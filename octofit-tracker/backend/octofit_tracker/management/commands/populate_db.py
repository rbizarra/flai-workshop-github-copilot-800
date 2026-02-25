from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        # Create users (superheroes)
        self.stdout.write('Creating users...')
        users_data = [
            {'name': 'Tony Stark', 'username': 'ironman', 'email': 'tony@starkindustries.com', 'password': 'pepper3000'},
            {'name': 'Peter Parker', 'username': 'spiderman', 'email': 'peter@dailybugle.com', 'password': 'webslinger'},
            {'name': 'Thor Odinson', 'username': 'thor', 'email': 'thor@asgard.com', 'password': 'mjolnir'},
            {'name': 'Steve Rogers', 'username': 'captainamerica', 'email': 'steve@shield.com', 'password': 'vibraniumshield'},
            {'name': 'Bruce Wayne', 'username': 'batman', 'email': 'bruce@wayneenterprises.com', 'password': 'darknight'},
            {'name': 'Diana Prince', 'username': 'wonderwoman', 'email': 'diana@themyscira.com', 'password': 'lasso0ftruth'},
            {'name': 'Clark Kent', 'username': 'superman', 'email': 'clark@dailyplanet.com', 'password': 'kryptonite'},
            {'name': 'Barry Allen', 'username': 'theflash', 'email': 'barry@centralcitylab.com', 'password': 'speedforce'},
        ]
        users = []
        for u in users_data:
            user = User.objects.create(**u)
            users.append(user)
            self.stdout.write(f'  Created user: {user.username}')

        # Create teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            members=['ironman', 'spiderman', 'thor', 'captainamerica']
        )
        team_dc = Team.objects.create(
            name='Team DC',
            members=['batman', 'wonderwoman', 'superman', 'theflash']
        )
        self.stdout.write(f'  Created team: {team_marvel.name}')
        self.stdout.write(f'  Created team: {team_dc.name}')

        # Create activities
        self.stdout.write('Creating activities...')
        activities_data = [
            {'username': 'ironman', 'activity_type': 'Flight Training', 'duration': '60 mins', 'calories': 600, 'date': date(2024, 1, 10)},
            {'username': 'spiderman', 'activity_type': 'Web Swinging', 'duration': '45 mins', 'calories': 450, 'date': date(2024, 1, 11)},
            {'username': 'thor', 'activity_type': 'Hammer Throw', 'duration': '30 mins', 'calories': 400, 'date': date(2024, 1, 12)},
            {'username': 'captainamerica', 'activity_type': 'Shield Training', 'duration': '50 mins', 'calories': 500, 'date': date(2024, 1, 10)},
            {'username': 'batman', 'activity_type': 'Martial Arts', 'duration': '90 mins', 'calories': 750, 'date': date(2024, 1, 11)},
            {'username': 'wonderwoman', 'activity_type': 'Sword Training', 'duration': '75 mins', 'calories': 620, 'date': date(2024, 1, 12)},
            {'username': 'superman', 'activity_type': 'Super Speed Run', 'duration': '20 mins', 'calories': 300, 'date': date(2024, 1, 13)},
            {'username': 'theflash', 'activity_type': 'Speed Force Run', 'duration': '10 mins', 'calories': 280, 'date': date(2024, 1, 13)},
        ]
        for a in activities_data:
            activity = Activity.objects.create(**a)
            self.stdout.write(f'  Created activity: {activity.username} - {activity.activity_type}')

        # Create leaderboard
        self.stdout.write('Creating leaderboard...')
        leaderboard_data = [
            {'username': 'ironman', 'score': 980},
            {'username': 'spiderman', 'score': 870},
            {'username': 'thor', 'score': 950},
            {'username': 'captainamerica', 'score': 900},
            {'username': 'batman', 'score': 930},
            {'username': 'wonderwoman', 'score': 910},
            {'username': 'superman', 'score': 990},
            {'username': 'theflash', 'score': 970},
        ]
        for lb in leaderboard_data:
            entry = Leaderboard.objects.create(**lb)
            self.stdout.write(f'  Created leaderboard entry: {entry.username} - {entry.score}')

        # Create workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Iron Man Power Blast',
                'description': 'High-intensity suit power training for maximum repulsor output.',
                'exercises': ['Repulsor Blast x20', 'Suit Endurance Run 5km', 'Targeting Practice x30']
            },
            {
                'name': 'Spider Agility Circuit',
                'description': 'Agility and parkour training to enhance web-slinging efficiency.',
                'exercises': ['Wall Crawl 3 sets', 'Web Shoot Accuracy x50', 'Parkour Roll x20']
            },
            {
                'name': 'Asgardian Strength',
                'description': 'Thunder God strength and lightning control workout.',
                'exercises': ['Mjolnir Throw x15', 'Thunder Clap x10', 'Lightning Summon x5']
            },
            {
                'name': 'Shield Defense Combo',
                'description': 'Captain America defensive maneuvers with vibranium shield.',
                'exercises': ['Shield Block x30', 'Combat Roll x20', '5km Super Soldier Run']
            },
            {
                'name': 'Dark Knight Training',
                'description': 'Batman\'s elite detective and combat training regimen.',
                'exercises': ['Batarang Throw x25', 'Grapple Hook Swing x15', 'Martial Arts Combo x40']
            },
        ]
        for w in workouts_data:
            workout = Workout.objects.create(**w)
            self.stdout.write(f'  Created workout: {workout.name}')

        self.stdout.write(self.style.SUCCESS('Successfully populated octofit_db with superhero test data!'))
