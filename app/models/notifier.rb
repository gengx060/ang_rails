class Notifier < ActionMailer::Base

	default sender: "Mail Services <qshhz1@gmail.com>"
	# EXACTOR_ACCOUNT_SERVICES_EMAIL = "Mail Services <gengx064@gmail.com>"


	def signup_application_received(params)
		# Email header info MUST be added here
		recipients params[:email_to]
		subject params[:emailSubject]
		content_type "text/html"

		# Email body substitutions go here
		body params
	end

	def welcome(params)
		@username = params[:username]
		mail(to: nil, #params[:email],
				 bcc: ["gengx064@gmail.com"],
				 content_type: "text/html",
				 subject: params[:emailSubject]) do |format|
			format.html
		end
	end

end
