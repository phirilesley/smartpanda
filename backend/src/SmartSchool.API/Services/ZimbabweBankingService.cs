using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using SmartSchool.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Services
{
    public class ZimbabweBankingService
    {
        private readonly SmartSchoolDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ZimbabweBankingService> _logger;

        // ðŸ¦ Bank API Endpoints
        private readonly Dictionary<string, string> _bankEndpoints = new()
        {
            ["CBZ"] = "https://api.cbz.co.zw/v1",
            ["Steward"] = "https://api.stewardbank.co.zw/v1",
            ["Stanbic"] = "https://api.stanbic.co.zw/v1",
            ["ZB"] = "https://api.zbbank.co.zw/v1",
            ["FBC"] = "https://api.fbc.co.zw/v1"
        };

        // ðŸ“± Mobile Money Endpoints
        private readonly Dictionary<string, string> _mobileMoneyEndpoints = new()
        {
            ["EcoCash"] = "https://api.ecocash.co.zw/v1",
            ["OneMoney"] = "https://api.onemoney.co.zw/v1",
            ["Telecash"] = "https://api.telecash.co.zw/v1"
        };

        public ZimbabweBankingService(
            SmartSchoolDbContext context,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<ZimbabweBankingService> logger)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        // ðŸ¦ CBZ Bank Integration
        public async Task<BankTransferResult> ProcessCBZTransferAsync(CBZTransferRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("CBZBank");
                
                // ðŸ” Set authentication headers
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["CBZ:ApiKey"]}");
                client.DefaultRequestHeaders.Add("X-Client-Id", _configuration["CBZ:ClientId"]);

                // ðŸ“¤ Prepare CBZ API request
                var cbzRequest = new
                {
                    accountNumber = request.AccountNumber,
                    amount = request.Amount,
                    currency = "USD",
                    reference = $"SP-{request.StudentId}-{DateTime.Now:yyyyMMddHHmmss}",
                    beneficiaryName = request.SchoolName,
                    description = $"Smart Panda School Fees - {request.StudentName}",
                    transactionType = "TRANSFER",
                    priority = "NORMAL"
                };

                // ðŸŒ Call CBZ API
                var response = await client.PostAsJsonAsync($"{_bankEndpoints["CBZ"]}/transfers", cbzRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<CBZResponse>();
                    
                    // ðŸ’¾ Record transaction in Smart Panda
                    await RecordBankTransaction(new BankTransaction
                    {
                        TransactionId = result.TransactionId,
                        Bank = "CBZ",
                        Amount = request.Amount,
                        StudentId = request.StudentId,
                        ParentId = request.ParentId,
                        FeeId = request.FeeId,
                        Status = "PROCESSING",
                        CreatedDate = DateTime.Now,
                        EstimatedCompletion = DateTime.Now.AddHours(2)
                    });

                    // ðŸ“± Send notifications
                    await SendPaymentNotifications(request.ParentId, result.TransactionId, request.Amount);

                    return new BankTransferResult
                    {
                        Success = true,
                        TransactionId = result.TransactionId,
                        Status = "PROCESSING",
                        EstimatedTime = "2-3 hours",
                        ConfirmationCode = result.Reference,
                        Message = "Transfer initiated successfully"
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"CBZ Transfer failed: {error}");
                    
                    return new BankTransferResult
                    {
                        Success = false,
                        Error = error,
                        Message = "CBZ transfer failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CBZ Transfer exception");
                return new BankTransferResult
                {
                    Success = false,
                    Error = ex.Message,
                    Message = "System error during CBZ transfer"
                };
            }
        }

        // ðŸ¦ Steward Bank Integration
        public async Task<BankTransferResult> ProcessStewardTransferAsync(StewardTransferRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("StewardBank");
                
                // ðŸ” Authentication
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["Steward:ApiKey"]}");
                
                // ðŸ“¤ Prepare Steward Bank request
                var stewardRequest = new
                {
                    fromAccount = request.FromAccount,
                    toAccount = request.ToAccount,
                    amount = request.Amount,
                    currency = "USD",
                    reference = $"SP-FEE-{request.StudentId}",
                    narration = $"School fees payment for {request.StudentName}",
                    valueDate = DateTime.Now.ToString("yyyy-MM-dd")
                };

                // ðŸŒ Call Steward Bank API
                var response = await client.PostAsJsonAsync($"{_bankEndpoints["Steward"]}/payments/transfer", stewardRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<StewardResponse>();
                    
                    await RecordBankTransaction(new BankTransaction
                    {
                        TransactionId = result.TransactionId,
                        Bank = "Steward",
                        Amount = request.Amount,
                        StudentId = request.StudentId,
                        ParentId = request.ParentId,
                        FeeId = request.FeeId,
                        Status = "PROCESSING",
                        CreatedDate = DateTime.Now
                    });

                    return new BankTransferResult
                    {
                        Success = true,
                        TransactionId = result.TransactionId,
                        Status = "PROCESSING",
                        EstimatedTime = "1-2 hours",
                        ConfirmationCode = result.AuthorizationCode,
                        Message = "Steward Bank transfer initiated"
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new BankTransferResult
                    {
                        Success = false,
                        Error = error,
                        Message = "Steward Bank transfer failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Steward Bank Transfer exception");
                return new BankTransferResult
                {
                    Success = false,
                    Error = ex.Message,
                    Message = "System error during Steward Bank transfer"
                };
            }
        }

        // ðŸ¦ Stanbic Bank Integration
        public async Task<BankTransferResult> ProcessStanbicTransferAsync(StanbicTransferRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("StanbicBank");
                
                // ðŸ” Authentication
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["Stanbic:ApiKey"]}");
                
                // ðŸ“¤ Prepare Stanbic Bank request
                var stanbicRequest = new
                {
                    debitAccount = request.DebitAccount,
                    creditAccount = request.CreditAccount,
                    amount = request.Amount,
                    currency = "USD",
                    reference = $"SP-{request.StudentId}-{DateTime.Now:yyyyMMdd}",
                    beneficiaryName = request.SchoolName,
                    paymentDetails = $"School fees for {request.StudentName}",
                    priorityIndicator = "N"
                };

                // ðŸŒ Call Stanbic Bank API
                var response = await client.PostAsJsonAsync($"{_bankEndpoints["Stanbic"]}/payments/instant", stanbicRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<StanbicResponse>();
                    
                    await RecordBankTransaction(new BankTransaction
                    {
                        TransactionId = result.TransactionReference,
                        Bank = "Stanbic",
                        Amount = request.Amount,
                        StudentId = request.StudentId,
                        ParentId = request.ParentId,
                        FeeId = request.FeeId,
                        Status = "COMPLETED",
                        CreatedDate = DateTime.Now
                    });

                    return new BankTransferResult
                    {
                        Success = true,
                        TransactionId = result.TransactionReference,
                        Status = "COMPLETED",
                        EstimatedTime = "Instant",
                        ConfirmationCode = result.ApprovalCode,
                        Message = "Stanbic Bank transfer completed successfully"
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new BankTransferResult
                    {
                        Success = false,
                        Error = error,
                        Message = "Stanbic Bank transfer failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Stanbic Bank Transfer exception");
                return new BankTransferResult
                {
                    Success = false,
                    Error = ex.Message,
                    Message = "System error during Stanbic Bank transfer"
                };
            }
        }

        // ðŸ“± EcoCash Integration
        public async Task<EcoCashResult> ProcessEcoCashPaymentAsync(EcoCashRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("EcoCash");
                
                // ðŸ” Authentication
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["EcoCash:ApiKey"]}");
                
                // ðŸ“¤ Prepare EcoCash request
                var ecocashRequest = new
                {
                    merchantCode = _configuration["EcoCash:MerchantCode"],
                    phoneNumber = request.PhoneNumber,
                    amount = request.Amount,
                    currency = "USD",
                    reference = $"SP-FEE-{request.StudentId}",
                    description = $"Smart Panda School Fees - {request.StudentName}",
                    returnUrl = "https://smartpanda.school/payment/ecocash/callback",
                    cancelUrl = "https://smartpanda.school/payment/cancel"
                };

                // ðŸŒ Call EcoCash API
                var response = await client.PostAsJsonAsync($"{_mobileMoneyEndpoints["EcoCash"]}/payments/initiate", ecocashRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<EcoCashResponse>();
                    
                    // ðŸ’¾ Record mobile money transaction
                    await RecordMobileMoneyTransaction(new MobileMoneyTransaction
                    {
                        TransactionId = result.TransactionId,
                        Provider = "EcoCash",
                        PhoneNumber = request.PhoneNumber,
                        Amount = request.Amount,
                        StudentId = request.StudentId,
                        ParentId = request.ParentId,
                        FeeId = request.FeeId,
                        Status = "PENDING_USSD",
                        USSDCode = result.USSDCode,
                        CreatedDate = DateTime.Now,
                        ExpiresAt = DateTime.Now.AddMinutes(15)
                    });

                    // ðŸ“± Send USSD instructions via SMS
                    await SendUSSDInstructions(request.PhoneNumber, result.USSDCode);

                    return new EcoCashResult
                    {
                        Success = true,
                        TransactionId = result.TransactionId,
                        USSDCode = result.USSDCode,
                        Status = "PENDING_USSD",
                        ExpiryTime = "15 minutes",
                        Message = "Please dial the USSD code to complete payment"
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new EcoCashResult
                    {
                        Success = false,
                        Error = error,
                        Message = "EcoCash payment initiation failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EcoCash Payment exception");
                return new EcoCashResult
                {
                    Success = false,
                    Error = ex.Message,
                    Message = "System error during EcoCash payment"
                };
            }
        }

        // ðŸ“± OneMoney Integration
        public async Task<OneMoneyResult> ProcessOneMoneyPaymentAsync(OneMoneyRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("OneMoney");
                
                // ðŸ” Authentication
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["OneMoney:ApiKey"]}");
                
                // ðŸ“¤ Prepare OneMoney request
                var onemoneyRequest = new
                {
                    merchantId = _configuration["OneMoney:MerchantId"],
                    customerMsisdn = request.PhoneNumber,
                    amount = request.Amount,
                    currency = "USD",
                    transactionReference = $"SP-OM-{request.StudentId}-{DateTime.Now:yyyyMMddHHmmss}",
                    narration = $"School fees payment for {request.StudentName}",
                    customerEmail = request.Email
                };

                // ðŸŒ Call OneMoney API
                var response = await client.PostAsJsonAsync($"{_mobileMoneyEndpoints["OneMoney"]}/payments", onemoneyRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<OneMoneyResponse>();
                    
                    await RecordMobileMoneyTransaction(new MobileMoneyTransaction
                    {
                        TransactionId = result.TransactionId,
                        Provider = "OneMoney",
                        PhoneNumber = request.PhoneNumber,
                        Amount = request.Amount,
                        StudentId = request.StudentId,
                        ParentId = request.ParentId,
                        FeeId = request.FeeId,
                        Status = "PENDING_APPROVAL",
                        CreatedDate = DateTime.Now
                    });

                    return new OneMoneyResult
                    {
                        Success = true,
                        TransactionId = result.TransactionId,
                        Status = "PENDING_APPROVAL",
                        Message = "OneMoney payment initiated. Please check your OneMoney app to approve."
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new OneMoneyResult
                    {
                        Success = false,
                        Error = error,
                        Message = "OneMoney payment initiation failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OneMoney Payment exception");
                return new OneMoneyResult
                {
                    Success = false,
                    Error = ex.Message,
                    Message = "System error during OneMoney payment"
                };
            }
        }

        // ðŸ“Š Transaction Status Check
        public async Task<TransactionStatus> CheckTransactionStatusAsync(string transactionId, string provider)
        {
            try
            {
                switch (provider.ToLower())
                {
                    case "cbz":
                        return await CheckCBZStatusAsync(transactionId);
                    case "steward":
                        return await CheckStewardStatusAsync(transactionId);
                    case "stanbic":
                        return await CheckStanbicStatusAsync(transactionId);
                    case "ecocash":
                        return await CheckEcoCashStatusAsync(transactionId);
                    case "onemoney":
                        return await CheckOneMoneyStatusAsync(transactionId);
                    default:
                        return new TransactionStatus { Status = "UNKNOWN", Message = "Unknown provider" };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Transaction status check failed for {transactionId}");
                return new TransactionStatus { Status = "ERROR", Message = ex.Message };
            }
        }

        // ðŸ”„ ZIPIT Integration
        public async Task<ZIPITResult> ProcessZIPITTransferAsync(ZIPITRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("ZIPIT");
                
                // ðŸ” ZIPIT Authentication
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["ZIPIT:ApiKey"]}");
                
                // ðŸ“¤ Prepare ZIPIT request
                var zipitRequest = new
                {
                    sourceBank = request.SourceBank,
                    sourceAccount = request.SourceAccount,
                    destinationBank = request.DestinationBank,
                    destinationAccount = request.DestinationAccount,
                    amount = request.Amount,
                    currency = "USD",
                    reference = $"SP-ZIPIT-{request.StudentId}",
                    beneficiaryName = request.SchoolName,
                    narration = $"School fees payment via ZIPIT - {request.StudentName}"
                };

                // ðŸŒ Call ZIPIT API
                var response = await client.PostAsJsonAsync("https://api.zipit.co.zw/v1/transfers", zipitRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ZIPITResponse>();
                    
                    await RecordZIPITTransaction(new ZIPITTransaction
                    {
                        TransactionId = result.TransactionId,
                        Amount = request.Amount,
                        SourceBank = request.SourceBank,
                        DestinationBank = request.DestinationBank,
                        StudentId = request.StudentId,
                        ParentId = request.ParentId,
                        FeeId = request.FeeId,
                        Status = "PROCESSING",
                        CreatedDate = DateTime.Now
                    });

                    return new ZIPITResult
                    {
                        Success = true,
                        TransactionId = result.TransactionId,
                        Status = "PROCESSING",
                        EstimatedTime = "Real-time (2-5 minutes)",
                        Message = "ZIPIT transfer initiated successfully"
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new ZIPITResult
                    {
                        Success = false,
                        Error = error,
                        Message = "ZIPIT transfer failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ZIPIT Transfer exception");
                return new ZIPITResult
                {
                    Success = false,
                    Error = ex.Message,
                    Message = "System error during ZIPIT transfer"
                };
            }
        }

        // ðŸ”§ Helper Methods
        private async Task RecordBankTransaction(BankTransaction transaction)
        {
            _context.BankTransactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        private async Task RecordMobileMoneyTransaction(MobileMoneyTransaction transaction)
        {
            _context.MobileMoneyTransactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        private async Task RecordZIPITTransaction(ZIPITTransaction transaction)
        {
            _context.ZIPITTransactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        private async Task SendPaymentNotifications(Guid parentId, string transactionId, double amount)
        {
            // ðŸ“± Send SMS notification
            await SendSMSNotification(parentId, $"Payment of ${amount:F2} initiated. Transaction ID: {transactionId}");
            
            // ðŸ“§ Send email notification
            await SendEmailNotification(parentId, "Payment Initiated", $"Your payment of ${amount:F2} has been initiated. Transaction ID: {transactionId}");
            
            // ðŸ“± Push notification to mobile app
            await SendPushNotification(parentId, "Payment Initiated", $"Payment of ${amount:F2} has been initiated");
        }

        private async Task SendUSSDInstructions(string phoneNumber, string ussdCode)
        {
            var message = $"To complete your EcoCash payment, please dial: {ussdCode}. This code expires in 15 minutes.";
            await SendSMSNotification(phoneNumber, message);
        }

        private async Task SendSMSNotification(string phoneNumber, string message)
        {
            // ðŸ“± SMS Service Integration
            _logger.LogInformation($"SMS sent to {phoneNumber}: {message}");
        }

        private async Task SendEmailNotification(int userId, string subject, string message)
        {
            // ðŸ“§ Email Service Integration
            _logger.LogInformation($"Email sent to user {userId}: {subject} - {message}");
        }

        private async Task SendPushNotification(int userId, string title, string message)
        {
            // ðŸ“± Push Notification Service Integration
            _logger.LogInformation($"Push notification sent to user {userId}: {title} - {message}");
        }

        // ðŸ“Š Status Check Methods
        private async Task<TransactionStatus> CheckCBZStatusAsync(string transactionId)
        {
            var client = _httpClientFactory.CreateClient("CBZBank");
            var response = await client.GetAsync($"{_bankEndpoints["CBZ"]}/transfers/{transactionId}/status");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<CBZStatusResponse>();
                return new TransactionStatus
                {
                    Status = result.Status,
                    Message = result.Message,
                    ProcessedDate = result.ProcessedDate
                };
            }
            
            return new TransactionStatus { Status = "ERROR", Message = "Status check failed" };
        }

        private async Task<TransactionStatus> CheckStewardStatusAsync(string transactionId)
        {
            var client = _httpClientFactory.CreateClient("StewardBank");
            var response = await client.GetAsync($"{_bankEndpoints["Steward"]}/payments/{transactionId}/status");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<StewardStatusResponse>();
                return new TransactionStatus
                {
                    Status = result.Status,
                    Message = result.Message,
                    ProcessedDate = result.ProcessedDate
                };
            }
            
            return new TransactionStatus { Status = "ERROR", Message = "Status check failed" };
        }

        private async Task<TransactionStatus> CheckStanbicStatusAsync(string transactionId)
        {
            var client = _httpClientFactory.CreateClient("StanbicBank");
            var response = await client.GetAsync($"{_bankEndpoints["Stanbic"]}/payments/{transactionId}/status");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<StanbicStatusResponse>();
                return new TransactionStatus
                {
                    Status = result.Status,
                    Message = result.Message,
                    ProcessedDate = result.ProcessedDate
                };
            }
            
            return new TransactionStatus { Status = "ERROR", Message = "Status check failed" };
        }

        private async Task<TransactionStatus> CheckEcoCashStatusAsync(string transactionId)
        {
            var client = _httpClientFactory.CreateClient("EcoCash");
            var response = await client.GetAsync($"{_mobileMoneyEndpoints["EcoCash"]}/payments/{transactionId}/status");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<EcoCashStatusResponse>();
                return new TransactionStatus
                {
                    Status = result.Status,
                    Message = result.Message,
                    ProcessedDate = result.ProcessedDate
                };
            }
            
            return new TransactionStatus { Status = "ERROR", Message = "Status check failed" };
        }

        private async Task<TransactionStatus> CheckOneMoneyStatusAsync(string transactionId)
        {
            var client = _httpClientFactory.CreateClient("OneMoney");
            var response = await client.GetAsync($"{_mobileMoneyEndpoints["OneMoney"]}/payments/{transactionId}/status");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<OneMoneyStatusResponse>();
                return new TransactionStatus
                {
                    Status = result.Status,
                    Message = result.Message,
                    ProcessedDate = result.ProcessedDate
                };
            }
            
            return new TransactionStatus { Status = "ERROR", Message = "Status check failed" };
        }
    }

    // ðŸŽ¯ Data Models
    public class CBZTransferRequest
    {
        public string AccountNumber { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public string StudentName { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
        public string SchoolName { get; set; }
    }

    public class StewardTransferRequest
    {
        public string FromAccount { get; set; }
        public string ToAccount { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public string StudentName { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
    }

    public class StanbicTransferRequest
    {
        public string DebitAccount { get; set; }
        public string CreditAccount { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public string StudentName { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
        public string SchoolName { get; set; }
    }

    public class EcoCashRequest
    {
        public string PhoneNumber { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public string StudentName { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
    }

    public class OneMoneyRequest
    {
        public string PhoneNumber { get; set; }
        public double Amount { get; set; }
        public string Email { get; set; }
        public Guid studentId { get; set; }
        public string StudentName { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
    }

    public class ZIPITRequest
    {
        public string SourceBank { get; set; }
        public string SourceAccount { get; set; }
        public string DestinationBank { get; set; }
        public string DestinationAccount { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public string StudentName { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
        public string SchoolName { get; set; }
    }

    public class BankTransferResult
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; }
        public string Status { get; set; }
        public string EstimatedTime { get; set; }
        public string ConfirmationCode { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }

    public class EcoCashResult
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; }
        public string USSDCode { get; set; }
        public string Status { get; set; }
        public string ExpiryTime { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }

    public class OneMoneyResult
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }

    public class ZIPITResult
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; }
        public string Status { get; set; }
        public string EstimatedTime { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }

    public class TransactionStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime? ProcessedDate { get; set; }
    }

    // API Response Models
    public class CBZResponse
    {
        public string TransactionId { get; set; }
        public string Reference { get; set; }
        public string Status { get; set; }
    }

    public class StewardResponse
    {
        public string TransactionId { get; set; }
        public string AuthorizationCode { get; set; }
        public string Status { get; set; }
    }

    public class StanbicResponse
    {
        public string TransactionReference { get; set; }
        public string ApprovalCode { get; set; }
        public string Status { get; set; }
    }

    public class EcoCashResponse
    {
        public string TransactionId { get; set; }
        public string USSDCode { get; set; }
        public string Status { get; set; }
    }

    public class OneMoneyResponse
    {
        public string TransactionId { get; set; }
        public string Status { get; set; }
    }

    public class ZIPITResponse
    {
        public string TransactionId { get; set; }
        public string Status { get; set; }
    }

    // Status Response Models
    public class CBZStatusResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime ProcessedDate { get; set; }
    }

    public class StewardStatusResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime ProcessedDate { get; set; }
    }

    public class StanbicStatusResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime ProcessedDate { get; set; }
    }

    public class EcoCashStatusResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime ProcessedDate { get; set; }
    }

    public class OneMoneyStatusResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime ProcessedDate { get; set; }
    }

    // Database Entities (would be in separate files in real implementation)
    public class BankTransaction
    {
        public int Id { get; set; }
        public string TransactionId { get; set; }
        public string Bank { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? EstimatedCompletion { get; set; }
    }

    public class MobileMoneyTransaction
    {
        public int Id { get; set; }
        public string TransactionId { get; set; }
        public string Provider { get; set; }
        public string PhoneNumber { get; set; }
        public double Amount { get; set; }
        public Guid studentId { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string USSDCode { get; set; }
    }

    public class ZIPITTransaction
    {
        public int Id { get; set; }
        public string TransactionId { get; set; }
        public double Amount { get; set; }
        public string SourceBank { get; set; }
        public string DestinationBank { get; set; }
        public Guid studentId { get; set; }
        public Guid parentId { get; set; }
        public int FeeId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
