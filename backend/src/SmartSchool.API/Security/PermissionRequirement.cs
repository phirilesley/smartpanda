using Microsoft.AspNetCore.Authorization;

namespace SmartSchool.API.Security;

public sealed record PermissionRequirement(string Permission) : IAuthorizationRequirement;
