from django.db import models

class Tournament(models.Model):
	pass

class Match(models.Model):
	player1_id = models.IntegerField()
	player2_id = models.IntegerField()
	player1_score = models.IntegerField()
	player2_score = models.IntegerField()
	date = models.DateTimeField(auto_now=True)
	duration = models.FloatField()
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches", blank=True, null=True)
 

