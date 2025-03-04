from social_core.backends.oauth import BaseOAuth2

class Intra42OAuth2(BaseOAuth2):
	name = '42'
	AUTHORIZATION_URL = 'https://api.intra.42.fr/oauth/authorize'
	ACCESS_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
	ACCESS_TOKEN_METHOD = 'POST'
	SCOPE_SEPARATOR = ' '
	DEFAULT_SCOPE = ['public']  # Adjust scopes based on your needs

	def get_user_details(self, response):
		return {
			'username': response.get('login'),
			'email': response.get('email'),
			'first_name': response.get('first_name'),
			'last_name': response.get('last_name'),
		}

	def user_data(self, access_token, *args, **kwargs):
		return self.get_json(
			'https://api.intra.42.fr/v2/me',
			params={'access_token': access_token}
		)