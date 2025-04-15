from rest_framework import serializers
from TwoFactorAuth.models import TwoFA_code

#IMPORTANT ASUMPTION, THE "email" is clean data, no need to check for the quality of that
#either dosen't exist in the db or it exist, and if so it must be valid

class	SendEmailSerializer(serializers.ModelSerializer):
	email = serializers.EmailField()
	
	class Meta:
		model = TwoFA_code
		fields = [
			"email"
		]
	
	def validate(self, instance):
		if (not instance['email']):
			raise ValidationError(detail="Missing email")
		return instance

class	ValidateCodeSerializer(serializers.ModelSerializer):
	email = serializers.EmailField()
	
	class Meta:
		model = TwoFA_code
		fields = [
			"email",
			"code"
		]
	
	def validate(self, instance):
		if (not instance['email']):
			raise ValidationError(detail="Missing email")
		if (not instance['code']):
			raise ValidationError(detail="Missing 2FA code")
		return instance
