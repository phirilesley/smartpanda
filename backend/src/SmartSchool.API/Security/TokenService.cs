using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartSchool.Domain.Modules.Security;

namespace SmartSchool.API.Security;

public interface ITokenService
{
    Task<TokenResponse> CreateTokensAsync(AppUser user, IEnumerable<string> roles, IEnumerable<string> permissions);
}

public sealed record TokenResponse(string AccessToken, DateTime AccessTokenExpiresAtUtc, string RefreshToken, DateTime RefreshTokenExpiresAtUtc);

public class TokenService(IOptions<JwtOptions> jwtOptions) : ITokenService
{
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

    public Task<TokenResponse> CreateTokensAsync(AppUser user, IEnumerable<string> roles, IEnumerable<string> permissions)
    {
        var now = DateTime.UtcNow;
        var accessExpiry = now.AddMinutes(_jwtOptions.AccessTokenMinutes);
        var refreshExpiry = now.AddDays(_jwtOptions.RefreshTokenDays);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? user.Email ?? user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypesExt.TenantId, user.TenantId.ToString())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        claims.AddRange(permissions.Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(permission => new Claim(ClaimTypesExt.Permission, permission)));

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SigningKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = accessExpiry,
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
            SigningCredentials = credentials
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);
        var accessToken = handler.WriteToken(token);

        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        return Task.FromResult(new TokenResponse(accessToken, accessExpiry, refreshToken, refreshExpiry));
    }
}
