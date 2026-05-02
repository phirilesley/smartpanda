using System.Net;
using System.Net.Mail;

namespace SmartSchool.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken = default);
        Task SendEmailAsync(string to, string subject, string body, bool isHtml, CancellationToken cancellationToken = default);
        Task SendEmailWithAttachmentsAsync(string to, string subject, string body, List<EmailAttachment> attachments, CancellationToken cancellationToken = default);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
        {
            await SendEmailAsync(to, subject, body, true, cancellationToken);
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml, CancellationToken cancellationToken = default)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var host = smtpSettings["Host"];
                var port = int.Parse(smtpSettings["Port"] ?? "587");
                var username = smtpSettings["Username"];
                var password = smtpSettings["Password"];
                var enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");
                var fromEmail = smtpSettings["FromEmail"] ?? username;

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = enableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                mailMessage.To.Add(to);

                await client.SendMailAsync(mailMessage, cancellationToken);
                
                _logger.LogInformation("Email sent successfully to {Email} with subject {Subject}", to, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email} with subject {Subject}", to, subject);
                throw;
            }
        }

        public async Task SendEmailWithAttachmentsAsync(string to, string subject, string body, List<EmailAttachment> attachments, CancellationToken cancellationToken = default)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var host = smtpSettings["Host"];
                var port = int.Parse(smtpSettings["Port"] ?? "587");
                var username = smtpSettings["Username"];
                var password = smtpSettings["Password"];
                var enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");
                var fromEmail = smtpSettings["FromEmail"] ?? username;

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = enableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(to);

                // Add attachments
                foreach (var attachment in attachments)
                {
                    var attachmentData = new Attachment(new MemoryStream(attachment.Content), attachment.FileName, attachment.ContentType);
                    mailMessage.Attachments.Add(attachmentData);
                }

                await client.SendMailAsync(mailMessage, cancellationToken);
                
                _logger.LogInformation("Email with attachments sent successfully to {Email} with subject {Subject}", to, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email with attachments to {Email} with subject {Subject}", to, subject);
                throw;
            }
        }
    }

    public class EmailAttachment
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
    }
}
