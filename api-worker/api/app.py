from flask import Flask, Response, jsonify, request
from flask_restful import Resource, Api, reqparse
import praw
import collections as co
from datetime import datetime
import os

app = Flask(__name__)
# app.register_blueprint(errors)
api = Api(app)

# import env variables using dotenv
# from dotenv import load_dotenv
# load_dotenv()

# Reddit API setup
reddit = praw.Reddit(
    client_id=os.getenv("CLIENT"),
    client_secret=os.getenv("SECRET"),
    user_agent=os.getenv("USER_AGENT"),
    ratelimit_seconds=1
)

DATE_FORMAT = "%Y-%m-%d"
TIME_FORMAT = "%H:%M"

class Data(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('subreddit', type=str, help="The subreddit to get data about", location='args')
        parser.add_argument('count', type=int, help="The number of posts to sort through", location='args')
        parser.add_argument('startDate', type=str, help='Start date (inclusive) for data to include in calculation.', location='args')
        parser.add_argument('endDate', type=str, help='End date (inclusive) for data to include in calculation.', location='args')
        parser.add_argument('startTime', type=str, help="Start time (inclusive) for data to include in calculation.", location='args')
        parser.add_argument('endTime', type=str, help="End time (inclusive) for data to include in calculation.", location='args')
        args = parser.parse_args()

        date_filtering_start: bool = False
        date_filtering_end: bool = False
        time_filtering_start: bool = False
        time_filtering_end: bool = False

        # Check if date filtering is needed and if so, convert to datetime objects
        if args['startDate'] != None:
            date_filtering_start = True
            start_date_obj = datetime.strptime(args['startDate'], DATE_FORMAT)
        if args['endDate'] != None:
            date_filtering_end = True
            end_date_obj = datetime.strptime(args['endDate'], DATE_FORMAT)
            # Add a day to object to make it inclusive
            end_date_obj = end_date_obj.replace(day=end_date_obj.day + 1)
        
        # Check if time filtering is needed and if so, convert to datetime objects
        if args['startTime'] != None:
            time_filtering_start = True
            start_time_obj = datetime.strptime(args['startTime'], TIME_FORMAT)
        if args['endTime'] != None:
            time_filtering_end = True
            end_time_obj = datetime.strptime(args['endTime'], TIME_FORMAT)
            # Add an hour to object to make inclusive
            end_time_obj = end_time_obj.replace(hour=end_time_obj.hour + 1)

        if args['subreddit'] == None:
            return "Please specify a subreddit to get data about.", 400
        subreddit = args['subreddit']
        if args['count'] == None:
            count = 100
        else:
            count = args['count']    
        
        # Initialize data structures
        top_days = {'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0}
        top_hours = {'12AM': 0, '1AM': 0, '2AM': 0, '3AM': 0, '4AM': 0, '5AM': 0, '6AM': 0, '7AM': 0, '8AM': 0, '9AM': 0, '10AM': 0, '11AM': 0, '12PM': 0, '1PM': 0, '2PM': 0, '3PM': 0, '4PM': 0, '5PM': 0, '6PM': 0, '7PM': 0, '8PM': 0, '9PM': 0, '10PM': 0, '11PM': 0}
        top_words = co.Counter()
        top_word_lengths = co.Counter()
        post_count = 0
        
        for submission in reddit.subreddit(subreddit).top(time_filter='year', limit=count):
            # If post is out of date range, skip
            post_created = datetime.utcfromtimestamp(submission.created_utc)
            if date_filtering_start:
                if post_created < start_date_obj:
                    continue
            if date_filtering_end:
                if post_created > end_date_obj:
                    continue
            
            created_time = post_created.time()
            # If post is out of time range, skip
            if time_filtering_start:
                if created_time < start_time_obj.time():
                    continue
            if time_filtering_end:
                if created_time > end_time_obj.time():
                    continue
            
            # Begin processing post
            post_count += 1
            # Get day of week
            top_days[post_created.strftime("%A")] += 1

            # Get hour of post
            top_hours[post_created.strftime("%I%p").strip('0')] += 1

            words = submission.title.split()
            top_word_lengths[len(words)] += 1
            for word in words:
                top_words[word.lower()] += 1

        top10 = dict(top_words.most_common(10))
        to_return = {'matching_posts': post_count,'top_days': top_days, 'top_hours': top_hours, 'top_words': top10, 'top_word_lengths': top_word_lengths}
        response = jsonify(to_return)
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response

api.add_resource(Data, '/data')

# if __name__ == '__main__':
#     app.run(debug=True,host='0.0.0.0', port=9007)
