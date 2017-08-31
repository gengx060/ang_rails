class Notifier < ActionMailer::Base

	default sender: "Mail Services <gengx064@gmail.com>"
	# EXACTOR_ACCOUNT_SERVICES_EMAIL = "Mail Services <gengx064@gmail.com>"


	def signup_application_received(params)
		# Email header info MUST be added here
		recipients params[:email_to]
		from params[:email_from]
		subject params[:email_subject]
		content_type "text/html"

		# Email body substitutions go here
		body params
	end

	def welcome(recipient)
		# attachments['free_book.pdf'] = File.read('path/to/file.pdf')
		mail(to:  recipient,
			 bcc: ["gengx064@gmail.com"],
			subject: "New account information")
	end

end
