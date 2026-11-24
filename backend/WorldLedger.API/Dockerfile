FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS base
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src
COPY ["WorldLedger.API.csproj", "."]
RUN dotnet restore "WorldLedger.API.csproj"
COPY . .
RUN dotnet build "WorldLedger.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WorldLedger.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorldLedger.API.dll"]

