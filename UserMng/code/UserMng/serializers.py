from UserMng.models import User
from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from rest_framework import status

class UserProfileSerializer(serializers.ModelSerializer):
	is_logged = serializers.SerializerMethodField()

	class Meta:
		model = User
		fields = [
			"id",
			"username",
			"email",
			"font",
			"avatar",
			"language",
			"is_logged",
		]

	def get_is_logged(self, user):
		if Token.objects.filter(user=user):
			return True
		return False

	def to_representation(self, instance):
		response = super(UserProfileSerializer, self).to_representation(instance)
		if instance.avatar:
			response['avatar'] = instance.avatar.url
		return response

class FriendsSerializer(serializers.ModelSerializer):
	following = UserProfileSerializer(many=True, read_only=True)
	class Meta:
		model = User
		fields = [
			"following"
		]	

class UserLoginSerializer(serializers.ModelSerializer):
	email = serializers.CharField(write_only=True)
	password = serializers.CharField(write_only=True)

	class Meta:
		model = User
		fields = [
			"email",
			"password"
		]
	
	def validate(self, instance):
		if (not instance['password']):
			raise ValidationError(detail="Empty password")
		if (not instance['email']):
			raise ValidationError(detail="Empty email")
		return instance

class UserSingUpSerializer(serializers.ModelSerializer):
	username = serializers.CharField()
	first_name = serializers.CharField()
	last_name = serializers.CharField()
	email = serializers.EmailField()
	password = serializers.CharField(write_only=True)
	password2 = serializers.CharField(write_only=True)

	class Meta:
		model = User
		fields = [
			"username",
			"first_name",
			"last_name",
			"email",
			"password",
			"password2"
		]
		extra_kwargs = {
			'password': {"write_only": True}
		}

	def validate_email(self, email):
		if (User.objects.filter(email=email).exists()):
			detail = {
				"detail": "User Already exist!"
			}
			raise ValidationError(detail=detail)
		return email
	
	def validate(self, instance):
		if (instance['password'] != instance['password2']):
			msg = {
				"message": "Both password must match"
			}
			raise ValidationError(msg)
		return instance

	def create(self, validated_data):
		password = validated_data.pop('password')
		validated_data.pop('password2')
		user = User.objects.create(**validated_data)
		user.set_password(password)
		user.save()
		Token.objects.create(user=user)
		return (user)