from django.urls import path
from .views import UserHistory

urlpatterns = [
	path('<int:pk>/', UserHistory.as_view()),
]
