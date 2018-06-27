class Message < ActiveRecord::Base
	# has_many :user_tags, -> { where is_deleted: nil }
	# has_many :tags, :through => :user_tags
	# has_many :user_profiles
	# has_one :user, :foreign_key => :first_person_id
	has_one :user, :foreign_key => :user_id
	validates_presence_of :content, :message=>"Error Message"
	# validates_numericality_of :price, :message=>"Error Message"

	def self.read(params)
		en = self.find(params[:id])
		if en
			en.is_read = "\1"
			en.save!
		end
	end

	def self.list(params)
		self.find
	end
end
