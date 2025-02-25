from django.contrib.auth.forms import UserCreationForm as imported_creation_form
from django.contrib.auth.forms import UserChangeForm as imported_change_form

from .models import User

user_form_fields = (
	'avatar',
	'username',
	'email',
	'language',
	'font',
)

class UserCreationForm(imported_creation_form):
	class	Meta:
		model = User
		fields= user_form_fields

class UserChangeForm(imported_change_form):
	class Meta:
		model = User
		fields = user_form_fields