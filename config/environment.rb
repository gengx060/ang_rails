# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.delivery_method       = :smtp
ActionMailer::Base.logger                = nil
ActionMailer::Base.raise_delivery_errors = false

ActionMailer::Base.smtp_settings = {
	address:              "smtp.gmail.com",
	port:                 587,
	# ssl:                  465,
	user_name:            "gengx064@gmail.com",
	password:             "gege@841028",
	authentication:       :login,
	domain:               'gmail.com',
	ssl:                  true,
	enable_starttls_auto: true
}

