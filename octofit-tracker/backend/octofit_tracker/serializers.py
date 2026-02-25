from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'name', 'username', 'email', 'password']

    def get__id(self, obj):
        return str(obj.pk)


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']

    def get__id(self, obj):
        return str(obj.pk)


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'username', 'activity_type', 'duration', 'calories', 'date']

    def get__id(self, obj):
        return str(obj.pk)


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'username', 'score']

    def get__id(self, obj):
        return str(obj.pk)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    exercises = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'exercises']

    def get__id(self, obj):
        return str(obj.pk)

    def get_exercises(self, obj):
        """Normalize Djongo JSONField: always return a plain list of strings."""
        raw = obj.exercises
        if not raw:
            return []
        if isinstance(raw, str):
            import json
            try:
                raw = json.loads(raw)
            except (ValueError, TypeError):
                return [raw]
        if isinstance(raw, list):
            result = []
            for item in raw:
                if isinstance(item, str):
                    result.append(item)
                elif isinstance(item, dict):
                    # Djongo wraps items as {0: 'value'} or {'value': 'value'}
                    vals = list(item.values())
                    result.append(str(vals[0]) if vals else str(item))
                else:
                    result.append(str(item))
            return result
        return [str(raw)]
