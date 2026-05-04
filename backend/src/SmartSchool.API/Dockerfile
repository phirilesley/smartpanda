# Use the official .NET 8 runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["SmartSchool.API.csproj", "./"]
RUN dotnet restore "SmartSchool.API.csproj"

# Copy the rest of the files and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "SmartSchool.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "SmartSchool.API.csproj" -c Release -o /app/publish

# Build the final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create necessary directories
RUN mkdir -p /app/logs /app/uploads

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "SmartSchool.API.dll"]
