def generateTournamentSchedule(list_of_players):
    number_players = len(list_of_players)

    if number_players < 4:
        return -1

    if number_players % 2  != 0:
        return -1

    schedule = '['
    for i in range(number_players - 1):
        tmp1 = list_of_players[:len(list_of_players) // 2]
        tmp2 = list_of_players[len(list_of_players) // 2:]

        tmp2.reverse()
        
        schedule += '['
        for j,k in zip(tmp1, tmp2):
            schedule += f'{{"player1":{j},"player2":{k}}},'
        schedule = schedule[:-1] + '],'

        tmp3 = list_of_players.pop()
        list_of_players.insert(1, tmp3)
    schedule = schedule[:-1] + ']'
    
    return schedule
