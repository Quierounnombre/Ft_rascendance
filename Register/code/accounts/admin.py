from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as imported_admin

from .forms import UserCreationForm
from .forms import UserChangeForm
from .models import User

class	AdminUser(imported_admin):
	add_form = UserCreationForm
	form = UserChangeForm
	model  = User
	list_display = ["email", "username",]

	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Personal Info', {'fields': ('username', 'avatar', 'language', 'font')}),
		('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
		('Important dates', {'fields': ('last_login', 'date_joined')}),
	)


admin.site.register(User, AdminUser)
