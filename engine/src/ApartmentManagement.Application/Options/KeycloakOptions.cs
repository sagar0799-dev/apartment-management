namespace ApartmentManagement.Application.Options;

public record KeycloakOptions
{
    public const string SectionName = "Keycloak";

    public string Authority { get; init; } = string.Empty;
    public string Realm { get; init; } = string.Empty;
    public string ClientId { get; init; } = string.Empty;
    public bool RequireHttpsMetadata { get; init; } = false;
}
