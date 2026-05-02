using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SmartSchool.Persistence.Data;

public class SmartSchoolDbContextFactory : IDesignTimeDbContextFactory<SmartSchoolDbContext>
{
    public SmartSchoolDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<SmartSchoolDbContext>();
        optionsBuilder.UseSqlServer("Server=.;Database=SmartSchoolDb;Trusted_Connection=True;TrustServerCertificate=True");
        return new SmartSchoolDbContext(optionsBuilder.Options);
    }
}
