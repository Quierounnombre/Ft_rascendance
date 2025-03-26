from django.urls import path
from .views import AddMatch
from .views import UserHistory

urlpatterns = [
	path('add/', AddMatch.as_view(), name="add"),
	path('<int:pk>/', UserHistory.as_view(), name="add"),
]
