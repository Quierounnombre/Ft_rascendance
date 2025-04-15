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

class UserSaveSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = [
			"id",
			"username",
			"email",
			"font",
			"avatar",
			"language",
			"me_color",
			"other_color",
			"ball_color",
			"counter_color",
		]


	def to_representation(self, instance):
		response = super(UserSaveSerializer, self).to_representation(instance)
		if instance.avatar:
			response['avatar'] = instance.avatar.url
		return response


class UserColorsSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = [
			"me_color",
			"other_color",
			"ball_color",
			"counter_color",
		]

class FriendsSerializer(serializers.ModelSerializer):
	following = UserProfileSerializer(many=True, read_only=True)
	class Meta:
		model = User
		fields = [
			"following"
		]	

class UserLoginSerializer(serializers.ModelSerializer):
	email = serializers.EmailField(write_only=True)
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

	def validate(self, instance):
		if (instance['password'] != instance['password2']):
			msg = {
				"message": "Both password must match"
			}
			raise ValidationError(msg)
		if (User.objects.filter(email=instance['email'], have_logged=True).exists()):
			detail = {
				"detail": "User Already exist!"
			}
			raise ValidationError(detail=detail)
		return instance

	def create(self, validated_data):
		validated_data.pop('password2')
		user, created = User.objects.update_or_create(
			email=validated_data['email'], 
			defaults=validated_data
			)
		if not created:
			ValidationError({"detail": "Can't create user"})
		password = validated_data.pop('password')
		user.set_password(password)
		return (user)