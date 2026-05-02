using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Integrations;

public class IntegrationSetting : TenantSchoolEntityBase
{
    public string IntegrationType { get; set; } = string.Empty;
    public string ProviderName { get; set; } = string.Empty;
    public string EncryptedSettingsJson { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
}

public class PaymentGatewayWebhook : TenantSchoolEntityBase
{
    public string ProviderName { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = string.Empty;
    public DateTime ReceivedAtUtc { get; set; }
    public bool IsProcessed { get; set; }
}
