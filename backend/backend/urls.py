"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework_bulk.routes import BulkRouter

from core.views import TodoItemViewSet
from users.views import UserRegistrationView

router = BulkRouter()
router.register("todo_items", TodoItemViewSet, basename='todo_items')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/login/", ObtainAuthToken.as_view()),
    path("api/signup/", UserRegistrationView.as_view()),
    path("api/", include(router.urls)),
]
