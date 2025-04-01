def generateTournamentSchedule(list_of_players):
    number_players = len(list_of_players)
    temporal_list = []
    schedule = []

    if number_players % 2  != 0:
        return

    for player in list_of_players:
        temporal_list.append(player)

    for i in range(number_players - 1):
        tmp1 = temporal_list[:len(temporal_list) // 2]
        tmp2 = temporal_list[len(temporal_list) // 2:]

        tmp2.reverse()
        
        tmp3 = []

        for j,k in zip(tmp1, tmp2):
            tmp3.append((j, k))
        
        schedule.append(tmp3)

        tmp3 = temporal_list.pop()
        temporal_list.insert(1, tmp3)
    
    return schedule