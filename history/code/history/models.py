from django.db import models

class Tournament(models.Model):
	pass

class Match(models.Model):
	winner_id = models.IntegerField()
	loser_id = models.IntegerField()
	winner_goals = models.IntegerField()
	loser_goals = models.IntegerField()
	date = models.DateTimeField(auto_now=True)
	duration = models.TimeField()
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches", blank=True, null=True)
 

