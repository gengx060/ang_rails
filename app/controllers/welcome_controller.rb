class WelcomeController < ApplicationController
	before_action :check_auth, :except => ["index", "check_auth", "test"]
	protect_from_forgery with: :null_session
	def index
		render file: "../assets/javascripts/index.html", layout: true
	end

	def ajax
		render :json => {:success => true, :product => {s: 1}.as_json()}
	end

	def test
		require 'uri'
		require 'net/http'

		url = URI("https://salestaxcontroller-sbg-e2e.api.intuit.com/v4/entities")
		ticket = "eyJraWQiOiJJbnR1aXQuY3RvLmlhbS5oYXRzLnByZXByZC4wOTIyMjAxMyIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiI1MTE4MzU4NTY4ODA2NDc2OTMzIiwiaXNzIjoiSW50dWl0LmN0by5pYW0uaGF0cyIsIngucndzIjoxMjA5NjAwMDAwLCJ4LmFleHAiOjE1MjgxMzU5ODQ2OTksIngubHJ0IjoxNTI4MTM1Mzg0NzI0LCJ4LmFyaWQiOiIxMjMxNDc1MDcxNjE4NDQiLCJ4LmF0Y2siOiI5VGx0Q3pnRU9NMXoxbHJ2WitlalFUSmVjb3RXd0ZsZ3FNZzhscW9lbk1tYTkzMVwvQ1wvM1JIOFRIMVhOc0F2c1ZxeHNEdUJvbFFaR2ZBeXQxOWhBVDVqamh0QTlndVZhYkFxMUZuNEtqekRWWTliNjVndExQWlVPZzFMU3RXM25lNU8yNE11M05LNzNpWjRGQXBHVWh5aUdsRTBzZW80UGVlZ1p5cUN5dnQ3S1wvVFwvd3JiK1VRekRNeU9FUTVMY21vM2htcHp0dnhHMmRSS1RCYWNXbXpXbHpVRzRHVXV0alhONERjd3BtUEhCbGJTVzdGUjRMWkRqcjVmS0VwRDRHUVhOaVVTUDRmU01lSEFzZjRJRzY3cm9DMmUweGJcL2hZZlFabENvTzVKdnpCOCtTa0g4NUF2a1U1VWtiZ3R3UDdheWZvT2F4Y3YxeVVnMEU4WVpyN0hiWWpyN0dSbUoyZlVqTW1sS0RpMDltcnFUQ3J1SmZVNmdHU1dsMFhsc2hcL0dLXC9yTmYxRWh0UE9mVGsrM2JIQlNySG5qMitVdkJPZks0TFdzMll0M0U0amRwNHNxWTdESUhxb3ptaEpVdUNEbmJENE5DcDNkYmZpVWR1RW9YbU5zdnV1bEJJRnF5cHVUSEVMVzBROHdmdXdWK0FtQ1lXNUxnVEFUejcra2pHZDRPa1JzNVpuVVh4VEpVV0tweUYzSVdRR21HVzFmc2pYZENKUDZuOEFKXC9EZkVTM1kxT3pFWjcxd25Xb0huSDBVQ2M4WkVIN0JkMVpmQTJId0hGYkRXU0F5XC9Gc3QzdmYwSTkwVEh5dFlHK3huUGEzZk02NzZGRjBoOXREWUI4UHdVdFJrKytKdWxcL0Z0Nit6WEkyaFdYYUxPNnpYckZcL3F1QkpcL3J2RkgwaVIwVnhtazNEcmhJT1ZmK05LSkR0RForTTJ6THRtQnk1amJpVU96ZExqTzI0MDVqY2NUMDQxaCtMRjIwWVl6TWlLZjYwcG1xVkplQWFSd1VONkFjXC9MSGxcLzg1Nkl2cUxlaWFKNFBuaWxkMmtLaDFQd1RVc09pQ09CdFRscHRLUWd4VXhhWmJXME1BdjRGQlZmWFd5MUF3cHhsU1o0WXBDTjl2QjI2bUlsYitqeEYyVTVBWjZwajJCNGY2Y1B6TFhFOHg2MXFlQ2tPOStRYnRjYVJSTGpMUlVQK3EyUEZaUWgxd0FaNFRHcURJd3RLdlY5dG1wQjZIaSt3SnVXbjd5aUNHdkZyTytKa2VEWVlcL045TXhHUFpPRXIwckNZV3hMeDBvS2N3QnYyOG5sTTlWKzJzWVNJeWt2UEVTNlhXQTFzQWJcL0NBdWYrdDkrQ2sremZrY3FVNnlIeDRXTjNNaUM1RVJ6cVRJREZIcEtaSitTNkxPSjNHVVRvVTV6RnR3dm0rNnBxOFZqUHc5eUpKWk8yenRndlJwemN5Z2RreWxVZFUzZk05XC9oYVRUS2tYVVIycEpXM0FTaWdQWXpad2RQNHJTU3VyRUV0WXBNSmNWSlFhY3c5UXhLRnFZenFKM1JsSXZ4VkY1RzRNOHJqUkYyenB1bmhIV2ZOS0ZySytlbGJFYkdUOGp5UGVqOWpxa3JuSU55SlRDd1VOb05hTkRPV0d4WExjNVpuajJuUytHekhNd1I3YndnY2JMTU95WjM5cERFb3EwdU5ldXUrdkErTEMxVmJMWHhrVEJFaUxVZkdwTXVwZE93Y1IzMk9ITk5laWVLbXN3eU96RzZcL0R3MmQxWUxKemxxZ3NKbFB1M3NrMElNXC9Jb2U2NStPZWlzV0FYbTZJTHk3eGk3ZnBvN1pDNU83ekd6cEMrYk40cXBGK0N6WjQ0S3Y4RFY4YXFjNXFRenNTclBsY2FPSzFKa1hLVTJ6VGMraDlPSlI3RDJGMGU1emlxYUVXS0x3OGJUZkUzalRSdWpxY1VISkx4XC95TGdxN1JOTDNZYUliVjN4Z3diUVwvcFcrVjMwOWhMcEZxWVpvdlRNbDlKazdiQlZSc1NaSVIwem1Za0dCVW01bFlhWDBIUm9rZ1RVSmxnT0VNWGFSVW15aXpwNDlvVEJSRG56R0dGbGg4UXZvRDRnR1djWmpLeVhqVEZoVWZ1Sm9NZytaVnowS2x4Q0doSGoyaDU5aEZ1ZkhTdTVpU3lUN0ZSTUJwR3ljQm9SVmFkVk15Q3I0TjZCaW9PUFYxQWVaWUlQa2Voclg0dnZcL3ZwN3hrWHBGcnkzbVQ2QWZTYVB3PT0iLCJ4LnNjcDIiOiI2MTk4MDk2NTc5NDY1MDc3NzcwLjAzIDYxOTgwOTY1Nzk0NjUwNzc3NzAuMDIgNjE5ODA5NjU3OTQ2NTA3Nzc3MC4wMSA2MTk4MDk2NTc5NDY1MDc3NzcwLjAwIiwiZXhwIjoxNTI4MjIxNzg0LCJpYXQiOjE1MjgxMzUzODQsImp0aSI6IjFlMWMxZjZlLWU3NDEtNGFjYS1iYzcwLWQwMmRiOTBkN2QwYSIsInguY3J0ciI6IjUxMTgzNTg1Njg4MDY0NzY5MzMifQ.VpnTK1lRNY-DeCd2PKJ2cmSWAmCMuCz_kbQ-mtarWEJ5nJKQZwRVIOzRoYfZezwG9c40Zk_j5R1d_Q0V3CG1ZGSiyVgIVGWl-Lm7dxAyMyE4Wb-k23unU8Xxq78hrpBCIpNkrJSYsMxDSXBdysPityHX3sGLFZhAIzc6EME6YK2JfSNaQWdiOVJ-of3O1yYvVvT21r-5bkTQacX6ta8ZkS1F9FoHRbyRX9tAZzFqXdPwG4xh2pRf3d6rmX68sjeJzgZjD67zqQVVLPUB5_c1G1rus-LFAiNToUK98a0RjkkRS0KbT2M-8vRdkBf2athn0ttOK0vG-JTUmByigp5Mxg"

		http = Net::HTTP.new(url.host, url.port)
		http.use_ssl = true
		http.verify_mode = OpenSSL::SSL::VERIFY_NONE

		request = Net::HTTP::Post.new(url)
		request["intuit_offeringid"] = 'salestaxcontroller-sbg-e2e.api.intuit.com'
		request["intuit_assetalias"] = 'salestaxcontroller-sbg-e2e.api.intuit.com'
		request["authorization"] = "Intuit_IAM_Authentication intuit_token_type=IAM-Offline-Ticket,intuit_appid=Intuit.qbshared.exactorsalestax,intuit_app_secret=preprdtvHeu4J9wku3ecDv6q6ZjQY4qmm7Wo0uHu,intuit_token=#{ticket}"
		request["content-type"] = 'application/json'
		request["cache-control"] = 'no-cache'
		request["postman-token"] = '42c9be27-85e5-5033-bed7-8d61ff27b5b0'
		request.body = "[{\n        \"$type\": \"/payments/AgencyPayment\",\n        \"salesTaxPaymentId\": \"6a46bdb8-4bc2-4c1b-b5e9-df1dc4515de8\",\n        \"identification\": \"1234567890\",\n        \"paymentAmount\": \"101.01\",\n        \"paymentDate\": \"2018-06-04\",\n        \"bankAccount\": {\n            \"bankAccount\": {\n            \"bankCode\": \"123123123\",\n            \"accountNumber\": \"1111111111\",\n            \"name\": \"CA:12345678\",\n            \"accountType\": \"CHECKING\"\n            }\n        },\n        \"addendas\": [\n            \"Addenda One\",\n            \"Addenda Two\",\n            \"Addenda Three\"\n        ]\n    }]\n    "

		response = http.request(request)
		puts response.read_body
		render :json => {:success => true, :product => "test"}
	end

end
