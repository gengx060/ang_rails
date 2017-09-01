# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.logger = nil
ActionMailer::Base.raise_delivery_errors = true

ActionMailer::Base.smtp_settings = {
		address: "smtp.gmail.com",
		port: 587,
		user_name: "qshhz1@gmail.com",
		password: "gege841028",
		authentication: :login,
		domain: 'smtp.gmail.com',
		tsl:                  true,
		# enable_starttls_auto: true,
		# enable_starttls_auto: false,
		outgoing_address: "Mail Services <qshhz1@gmail.com>",
		openssl_verify_mode: 'none'
}

