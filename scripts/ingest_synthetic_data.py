import csv
import json
import sqlite3
from datetime import datetime, timezone
import io

CSV_DATA = """case_id,state,age_group,gender,incident_type,preferred_language,intake_channel,sleep_difficulty_0_4,persistent_worry_0_4,concentration_difficulty_0_4,fear_or_alarm_0_4,avoidance_0_4,emotional_distress_0_4,support_need_0_4,synthetic_user_text,stress_indicator_score_0_100,trauma_indicator_score_0_100,overall_assessment_score_0_100,assessment_level,human_review
SYN-NHAA-0001,Tamil Nadu,25-34,Female,Discrimination,Bengali,Operator-entered notes,0,4,0,2,3,4,0,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,75.0,61.2,Moderate,Routine review
SYN-NHAA-0002,Andhra Pradesh,25-34,Female,Other,English,Helpline text intake,0,4,3,2,1,4,0,I feel mostly okay now but would like information about available support.,68.8,58.3,64.1,Moderate,Routine review
SYN-NHAA-0003,Karnataka,55+,Male,Accident/traumatic event,Hindi,Helpline text intake,3,0,3,2,0,1,4,I have been feeling worried since the incident and my sleep has been affected.,43.8,25.0,35.3,Moderate,Routine review
SYN-NHAA-0004,Uttar Pradesh,35-44,Male,Domestic conflict,Hindi,Web portal,1,0,0,1,4,3,0,"I am able to manage most activities, but I still feel stressed about what happened.",25.0,66.7,43.8,Moderate,Routine review
SYN-NHAA-0005,Maharashtra,35-44,Male,Workplace issue,Malayalam,Web portal,3,0,4,2,4,0,2,I find it difficult to concentrate and keep thinking about the incident.,43.8,50.0,46.6,Moderate,Routine review
SYN-NHAA-0006,Kerala,25-34,Male,Cyber harassment,Malayalam,Helpline text intake,2,1,1,0,0,0,3,I find it difficult to concentrate and keep thinking about the incident.,25.0,0.0,13.8,Low,Routine review
SYN-NHAA-0007,Odisha,25-34,Female,Accident/traumatic event,Bengali,Web portal,2,4,0,4,0,3,4,I find it difficult to concentrate and keep thinking about the incident.,56.2,58.3,57.1,Moderate,Routine review
SYN-NHAA-0008,Karnataka,25-34,Male,Community/social conflict,Hindi,Operator-entered notes,1,1,2,3,2,4,4,I have been feeling worried since the incident and my sleep has been affected.,50.0,75.0,61.2,Moderate,Routine review
SYN-NHAA-0009,Kerala,18-24,Female,Legal dispute,Marathi,Helpline text intake,1,2,4,0,0,1,3,I feel mostly okay now but would like information about available support.,50.0,8.3,31.2,Low,Routine review
SYN-NHAA-0010,Kerala,25-34,Male,Financial fraud,Bengali,Helpline text intake,3,4,3,1,1,1,3,I have been feeling worried since the incident and my sleep has been affected.,68.8,25.0,49.1,Moderate,Routine review
SYN-NHAA-0011,Gujarat,25-34,Prefer not to say,Domestic conflict,Kannada,Web portal,2,0,2,4,1,4,3,I find it difficult to concentrate and keep thinking about the incident.,50.0,75.0,61.2,Moderate,Recommended
SYN-NHAA-0012,Odisha,18-24,Prefer not to say,Workplace issue,Malayalam,Helpline text intake,4,1,1,1,2,1,1,I feel mostly okay now but would like information about available support.,43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0013,Rajasthan,18-24,Female,Discrimination,Bengali,Web portal,4,4,1,2,3,2,0,I feel mostly okay now but would like information about available support.,68.8,58.3,64.1,Moderate,Routine review
SYN-NHAA-0014,Telangana,25-34,Female,Cyber harassment,Marathi,Web portal,2,2,4,2,3,4,4,I feel uncomfortable discussing the incident and would like support.,75.0,75.0,75.0,High,Recommended
SYN-NHAA-0015,Karnataka,18-24,Female,Legal dispute,Telugu,Web portal,1,4,1,0,0,4,0,I find it difficult to concentrate and keep thinking about the incident.,62.5,33.3,49.4,Moderate,Routine review
SYN-NHAA-0016,West Bengal,18-24,Female,Cyber harassment,Telugu,Web portal,1,0,4,1,4,4,3,I feel mostly okay now but would like information about available support.,56.2,75.0,64.7,Moderate,Routine review
SYN-NHAA-0017,Uttar Pradesh,25-34,Female,Cyber harassment,Hindi,Helpline text intake,2,2,1,0,4,1,0,I feel uncomfortable discussing the incident and would like support.,37.5,41.7,39.4,Moderate,Routine review
SYN-NHAA-0018,Karnataka,25-34,Female,Community/social conflict,Bengali,Web portal,3,1,1,1,0,0,3,I feel uncomfortable discussing the incident and would like support.,31.2,8.3,20.9,Low,Routine review
SYN-NHAA-0019,Kerala,35-44,Male,Harassment,Tamil,Web portal,2,1,4,4,0,0,3,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0020,Telangana,25-34,Female,Legal dispute,Tamil,Web portal,2,2,3,3,0,3,3,"I am able to manage most activities, but I still feel stressed about what happened.",62.5,50.0,56.9,Moderate,Routine review
SYN-NHAA-0021,Karnataka,25-34,Female,Harassment,English,Helpline text intake,3,4,1,0,4,2,3,I find it difficult to concentrate and keep thinking about the incident.,62.5,50.0,56.9,Moderate,Routine review
SYN-NHAA-0022,Rajasthan,25-34,Female,Other,Kannada,Helpline text intake,3,1,0,3,4,3,1,I find it difficult to concentrate and keep thinking about the incident.,43.8,83.3,61.6,Moderate,Routine review
SYN-NHAA-0023,Gujarat,45-54,Male,Harassment,Malayalam,Operator-entered notes,2,4,0,3,3,2,1,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,66.7,57.5,Moderate,Routine review
SYN-NHAA-0024,Odisha,18-24,Prefer not to say,Harassment,Telugu,Web portal,0,0,1,2,2,0,1,"I am able to manage most activities, but I still feel stressed about what happened.",6.2,33.3,18.4,Low,Routine review
SYN-NHAA-0025,Andhra Pradesh,35-44,Female,Cyber harassment,English,Web portal,4,1,1,0,1,0,0,I find it difficult to concentrate and keep thinking about the incident.,37.5,8.3,24.4,Low,Routine review
SYN-NHAA-0026,Delhi,18-24,Male,Community/social conflict,Telugu,Helpline text intake,2,2,2,2,4,3,1,I have been feeling worried since the incident and my sleep has been affected.,56.2,75.0,64.7,Moderate,Routine review
SYN-NHAA-0027,Rajasthan,45-54,Female,Harassment,Marathi,Web portal,3,3,1,4,2,3,0,I feel mostly okay now but would like information about available support.,62.5,75.0,68.1,High,Recommended
SYN-NHAA-0028,Karnataka,55+,Female,Community/social conflict,English,Web portal,3,0,1,1,4,1,1,I find it difficult to concentrate and keep thinking about the incident.,31.2,50.0,39.7,Moderate,Routine review
SYN-NHAA-0029,Gujarat,25-34,Male,Community/social conflict,Malayalam,Operator-entered notes,3,2,0,4,0,0,0,"I am able to manage most activities, but I still feel stressed about what happened.",31.2,33.3,32.1,Low,Routine review
SYN-NHAA-0030,Kerala,35-44,Female,Discrimination,English,Operator-entered notes,1,1,2,1,3,1,4,I feel uncomfortable discussing the incident and would like support.,31.2,41.7,35.9,Moderate,Routine review
SYN-NHAA-0031,Karnataka,45-54,Male,Discrimination,Hindi,Operator-entered notes,2,3,3,4,3,0,4,I feel mostly okay now but would like information about available support.,50.0,58.3,53.7,Moderate,Routine review
SYN-NHAA-0032,Gujarat,25-34,Female,Community/social conflict,Marathi,Helpline text intake,2,3,2,4,2,2,3,I feel uncomfortable discussing the incident and would like support.,56.2,66.7,60.9,Moderate,Routine review
SYN-NHAA-0033,Maharashtra,35-44,Female,Accident/traumatic event,Telugu,Web portal,1,4,3,3,2,4,3,I feel uncomfortable discussing the incident and would like support.,75.0,75.0,75.0,High,Recommended
SYN-NHAA-0034,Delhi,25-34,Male,Workplace issue,Hindi,Web portal,4,1,0,4,3,2,1,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,75.0,57.8,Moderate,Routine review
SYN-NHAA-0035,Uttar Pradesh,25-34,Male,Other,Malayalam,Operator-entered notes,1,1,1,2,4,4,1,I have been feeling worried since the incident and my sleep has been affected.,43.8,83.3,61.6,Moderate,Routine review
SYN-NHAA-0036,Maharashtra,25-34,Male,Community/social conflict,Hindi,Web portal,4,4,2,3,3,0,1,I feel mostly okay now but would like information about available support.,62.5,50.0,56.9,Moderate,Routine review
SYN-NHAA-0037,West Bengal,18-24,Male,Harassment,Hindi,Web portal,1,4,2,1,0,4,2,I feel mostly okay now but would like information about available support.,68.8,41.7,56.6,Moderate,Routine review
SYN-NHAA-0038,Uttar Pradesh,35-44,Female,Other,Bengali,Web portal,3,0,3,4,0,1,0,I have been feeling worried since the incident and my sleep has been affected.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0039,Kerala,45-54,Female,Accident/traumatic event,English,Helpline text intake,2,1,2,4,4,3,2,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,91.7,68.8,High,Recommended
SYN-NHAA-0040,Telangana,35-44,Female,Discrimination,Bengali,Helpline text intake,4,4,1,0,2,4,2,I feel uncomfortable discussing the incident and would like support.,81.2,50.0,67.2,High,Recommended
SYN-NHAA-0041,Rajasthan,55+,Male,Accident/traumatic event,Tamil,Web portal,1,4,1,3,2,2,0,I feel mostly okay now but would like information about available support.,50.0,58.3,53.7,Moderate,Routine review
SYN-NHAA-0042,Odisha,25-34,Male,Community/social conflict,Telugu,Operator-entered notes,4,2,2,2,2,0,4,I feel mostly okay now but would like information about available support.,50.0,33.3,42.5,Moderate,Routine review
SYN-NHAA-0043,Delhi,18-24,Male,Legal dispute,Hindi,Helpline text intake,0,3,1,0,0,4,2,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,33.3,42.5,Moderate,Routine review
SYN-NHAA-0044,Tamil Nadu,45-54,Male,Cyber harassment,Bengali,Web portal,4,0,1,4,3,2,1,I find it difficult to concentrate and keep thinking about the incident.,43.8,75.0,57.8,Moderate,Routine review
SYN-NHAA-0045,Rajasthan,35-44,Male,Cyber harassment,Telugu,Operator-entered notes,3,1,1,0,4,3,2,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,58.3,53.7,Moderate,Routine review
SYN-NHAA-0046,Karnataka,18-24,Male,Domestic conflict,Marathi,Helpline text intake,1,1,4,4,2,2,4,I have been feeling worried since the incident and my sleep has been affected.,50.0,66.7,57.5,Moderate,Routine review
SYN-NHAA-0047,Odisha,18-24,Non-binary/Other,Workplace issue,Malayalam,Web portal,0,1,0,2,4,3,0,I feel mostly okay now but would like information about available support.,25.0,75.0,47.5,Moderate,Routine review
SYN-NHAA-0048,Rajasthan,35-44,Male,Harassment,Malayalam,Operator-entered notes,2,4,3,3,4,4,2,I find it difficult to concentrate and keep thinking about the incident.,81.2,91.7,85.9,High,Recommended
SYN-NHAA-0049,Karnataka,35-44,Male,Community/social conflict,Malayalam,Web portal,2,1,1,2,3,4,3,I find it difficult to concentrate and keep thinking about the incident.,50.0,75.0,61.2,Moderate,Routine review
SYN-NHAA-0050,Karnataka,18-24,Female,Discrimination,English,Web portal,1,3,0,3,0,1,3,I feel uncomfortable discussing the incident and would like support.,31.2,33.3,32.1,Low,Routine review
SYN-NHAA-0051,West Bengal,45-54,Female,Cyber harassment,Telugu,Web portal,2,4,0,0,0,2,2,I find it difficult to concentrate and keep thinking about the incident.,50.0,16.7,35.0,Moderate,Routine review
SYN-NHAA-0052,West Bengal,25-34,Female,Discrimination,English,Web portal,1,1,0,2,2,1,3,I have been feeling worried since the incident and my sleep has been affected.,18.8,41.7,29.1,Low,Routine review
SYN-NHAA-0053,Tamil Nadu,25-34,Female,Accident/traumatic event,Malayalam,Operator-entered notes,2,2,4,0,3,3,4,I feel uncomfortable discussing the incident and would like support.,68.8,50.0,60.3,Moderate,Routine review
SYN-NHAA-0054,Gujarat,18-24,Female,Workplace issue,English,Helpline text intake,0,1,0,0,4,1,0,I find it difficult to concentrate and keep thinking about the incident.,12.5,41.7,25.6,Low,Routine review
SYN-NHAA-0055,Rajasthan,25-34,Male,Workplace issue,Tamil,Operator-entered notes,4,4,1,3,1,3,3,I find it difficult to concentrate and keep thinking about the incident.,75.0,58.3,67.5,High,Recommended
SYN-NHAA-0056,Karnataka,35-44,Male,Other,Bengali,Operator-entered notes,0,4,3,4,3,2,4,I find it difficult to concentrate and keep thinking about the incident.,56.2,75.0,64.7,Moderate,Routine review
SYN-NHAA-0057,Andhra Pradesh,35-44,Male,Financial fraud,Telugu,Web portal,3,1,4,3,2,0,2,I feel mostly okay now but would like information about available support.,50.0,41.7,46.3,Moderate,Routine review
SYN-NHAA-0058,Odisha,18-24,Female,Other,Tamil,Web portal,1,2,3,4,2,0,4,I have been feeling worried since the incident and my sleep has been affected.,37.5,50.0,43.1,Moderate,Routine review
SYN-NHAA-0059,Tamil Nadu,25-34,Male,Financial fraud,Bengali,Helpline text intake,0,4,0,1,0,4,4,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,41.7,46.3,Moderate,Routine review
SYN-NHAA-0060,Gujarat,25-34,Female,Domestic conflict,Kannada,Web portal,0,0,0,3,3,3,1,"I am able to manage most activities, but I still feel stressed about what happened.",18.8,75.0,44.1,Moderate,Routine review
SYN-NHAA-0061,Karnataka,35-44,Male,Community/social conflict,Marathi,Operator-entered notes,4,2,1,0,3,2,0,I feel mostly okay now but would like information about available support.,56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0062,Gujarat,18-24,Female,Harassment,Malayalam,Web portal,0,3,0,4,4,2,1,I feel mostly okay now but would like information about available support.,31.2,83.3,54.6,Moderate,Routine review
SYN-NHAA-0063,Odisha,45-54,Male,Financial fraud,Malayalam,Web portal,1,1,2,4,0,0,4,I feel mostly okay now but would like information about available support.,25.0,33.3,28.7,Low,Routine review
SYN-NHAA-0064,Maharashtra,55+,Prefer not to say,Harassment,Hindi,Helpline text intake,1,2,3,3,0,4,0,I feel mostly okay now but would like information about available support.,62.5,58.3,60.6,Moderate,Routine review
SYN-NHAA-0065,Uttar Pradesh,18-24,Female,Other,Malayalam,Web portal,4,3,3,3,4,2,1,I have been feeling worried since the incident and my sleep has been affected.,75.0,75.0,75.0,High,Recommended
SYN-NHAA-0066,Kerala,25-34,Prefer not to say,Harassment,Hindi,Web portal,1,4,1,1,1,4,4,I feel mostly okay now but would like information about available support.,62.5,50.0,56.9,Moderate,Routine review
SYN-NHAA-0067,West Bengal,25-34,Prefer not to say,Discrimination,Marathi,Operator-entered notes,4,4,1,4,1,2,3,I have been feeling worried since the incident and my sleep has been affected.,68.8,58.3,64.1,Moderate,Routine review
SYN-NHAA-0068,Kerala,45-54,Non-binary/Other,Financial fraud,Bengali,Operator-entered notes,2,0,3,0,1,4,0,"I am able to manage most activities, but I still feel stressed about what happened.",56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0069,Kerala,25-34,Male,Cyber harassment,Telugu,Helpline text intake,0,3,4,4,1,3,3,"I am able to manage most activities, but I still feel stressed about what happened.",62.5,66.7,64.4,Moderate,Routine review
SYN-NHAA-0070,Maharashtra,25-34,Female,Discrimination,Telugu,Helpline text intake,1,4,1,3,3,1,3,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,58.3,50.3,Moderate,Routine review
SYN-NHAA-0071,Maharashtra,25-34,Male,Legal dispute,Kannada,Web portal,4,1,0,3,0,3,0,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,50.0,50.0,Moderate,Routine review
SYN-NHAA-0072,Telangana,18-24,Male,Accident/traumatic event,Malayalam,Web portal,1,4,3,3,3,3,1,I have been feeling worried since the incident and my sleep has been affected.,68.8,75.0,71.6,High,Recommended
SYN-NHAA-0073,Maharashtra,18-24,Female,Cyber harassment,Kannada,Web portal,3,4,4,1,0,2,3,I find it difficult to concentrate and keep thinking about the incident.,81.2,25.0,55.9,Moderate,Routine review
SYN-NHAA-0074,Andhra Pradesh,35-44,Female,Harassment,Telugu,Web portal,4,0,2,4,4,1,0,I feel mostly okay now but would like information about available support.,43.8,75.0,57.8,Moderate,Routine review
SYN-NHAA-0075,West Bengal,25-34,Female,Discrimination,Tamil,Web portal,4,4,2,4,4,0,3,"I am able to manage most activities, but I still feel stressed about what happened.",62.5,66.7,64.4,Moderate,Routine review
SYN-NHAA-0076,Rajasthan,35-44,Male,Workplace issue,Kannada,Web portal,3,3,4,4,3,1,3,I feel mostly okay now but would like information about available support.,68.8,66.7,67.9,High,Recommended
SYN-NHAA-0077,Andhra Pradesh,55+,Female,Domestic conflict,English,Helpline text intake,3,1,3,2,0,2,1,I have been feeling worried since the incident and my sleep has been affected.,56.2,33.3,45.9,Moderate,Routine review
SYN-NHAA-0078,Tamil Nadu,25-34,Female,Domestic conflict,Kannada,Web portal,2,3,1,4,0,1,2,I have been feeling worried since the incident and my sleep has been affected.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0079,Maharashtra,55+,Male,Accident/traumatic event,Marathi,Web portal,4,3,2,3,3,0,3,I find it difficult to concentrate and keep thinking about the incident.,56.2,50.0,53.4,Moderate,Routine review
SYN-NHAA-0080,Uttar Pradesh,35-44,Female,Workplace issue,English,Operator-entered notes,3,4,2,1,2,2,3,I have been feeling worried since the incident and my sleep has been affected.,68.8,41.7,56.6,Moderate,Routine review
SYN-NHAA-0081,Kerala,35-44,Female,Financial fraud,Bengali,Web portal,3,3,4,3,4,0,3,I have been feeling worried since the incident and my sleep has been affected.,62.5,58.3,60.6,Moderate,Routine review
SYN-NHAA-0082,Kerala,25-34,Female,Financial fraud,English,Helpline text intake,2,0,2,3,4,0,0,I have been feeling worried since the incident and my sleep has been affected.,25.0,58.3,40.0,Moderate,Routine review
SYN-NHAA-0083,Karnataka,45-54,Prefer not to say,Cyber harassment,Malayalam,Web portal,3,1,3,4,0,0,3,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0084,Rajasthan,35-44,Female,Harassment,English,Helpline text intake,0,0,4,3,3,1,3,I feel mostly okay now but would like information about available support.,31.2,58.3,43.4,Moderate,Routine review
SYN-NHAA-0085,Karnataka,25-34,Male,Domestic conflict,Bengali,Web portal,2,4,1,4,0,4,2,I have been feeling worried since the incident and my sleep has been affected.,68.8,66.7,67.9,High,Recommended
SYN-NHAA-0086,Uttar Pradesh,45-54,Non-binary/Other,Workplace issue,Telugu,Operator-entered notes,4,0,2,2,2,0,3,"I am able to manage most activities, but I still feel stressed about what happened.",37.5,33.3,35.6,Moderate,Routine review
SYN-NHAA-0087,Uttar Pradesh,18-24,Male,Harassment,Kannada,Web portal,2,2,4,0,0,1,3,"I am able to manage most activities, but I still feel stressed about what happened.",56.2,8.3,34.6,Low,Routine review
SYN-NHAA-0088,Uttar Pradesh,25-34,Male,Domestic conflict,Malayalam,Helpline text intake,4,2,3,0,2,4,3,"I am able to manage most activities, but I still feel stressed about what happened.",81.2,50.0,67.2,High,Recommended
SYN-NHAA-0089,West Bengal,25-34,Male,Accident/traumatic event,Tamil,Web portal,1,2,0,4,3,2,3,I feel mostly okay now but would like information about available support.,31.2,75.0,50.9,Moderate,Routine review
SYN-NHAA-0090,Telangana,25-34,Female,Domestic conflict,Kannada,Web portal,4,4,3,1,2,0,0,I feel mostly okay now but would like information about available support.,68.8,25.0,49.1,Moderate,Routine review
SYN-NHAA-0091,Gujarat,35-44,Prefer not to say,Community/social conflict,Hindi,Helpline text intake,4,4,0,2,0,1,1,I have been feeling worried since the incident and my sleep has been affected.,56.2,25.0,42.2,Moderate,Routine review
SYN-NHAA-0092,Tamil Nadu,18-24,Prefer not to say,Domestic conflict,English,Web portal,3,3,4,1,4,4,1,I find it difficult to concentrate and keep thinking about the incident.,87.5,75.0,81.9,High,Recommended
SYN-NHAA-0093,Maharashtra,25-34,Female,Accident/traumatic event,Telugu,Web portal,0,1,1,1,4,4,1,I feel mostly okay now but would like information about available support.,37.5,75.0,54.4,Moderate,Routine review
SYN-NHAA-0094,Delhi,25-34,Male,Community/social conflict,Marathi,Web portal,4,4,1,1,3,2,2,I have been feeling worried since the incident and my sleep has been affected.,68.8,50.0,60.3,Moderate,Routine review
SYN-NHAA-0095,Delhi,18-24,Female,Financial fraud,Malayalam,Web portal,0,2,2,3,4,0,3,I find it difficult to concentrate and keep thinking about the incident.,25.0,58.3,40.0,Moderate,Routine review
SYN-NHAA-0096,Kerala,45-54,Female,Legal dispute,Tamil,Web portal,2,0,4,3,4,1,3,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,66.7,54.1,Moderate,Routine review
SYN-NHAA-0097,Delhi,18-24,Male,Financial fraud,Marathi,Web portal,2,0,2,2,0,1,1,I have been feeling worried since the incident and my sleep has been affected.,31.2,25.0,28.4,Low,Routine review
SYN-NHAA-0098,Maharashtra,25-34,Female,Accident/traumatic event,Hindi,Helpline text intake,4,3,3,3,0,0,3,"I am able to manage most activities, but I still feel stressed about what happened.",62.5,25.0,45.6,Moderate,Routine review
SYN-NHAA-0099,Odisha,35-44,Female,Legal dispute,Kannada,Helpline text intake,0,4,4,1,0,3,0,"I am able to manage most activities, but I still feel stressed about what happened.",68.8,33.3,52.8,Moderate,Routine review
SYN-NHAA-0100,Telangana,35-44,Prefer not to say,Other,Hindi,Web portal,4,1,2,4,1,2,0,I have been feeling worried since the incident and my sleep has been affected.,56.2,58.3,57.1,Moderate,Routine review
SYN-NHAA-0101,Maharashtra,18-24,Male,Legal dispute,Kannada,Web portal,1,3,1,2,3,2,1,I have been feeling worried since the incident and my sleep has been affected.,43.8,58.3,50.3,Moderate,Routine review
SYN-NHAA-0102,Tamil Nadu,18-24,Male,Discrimination,Hindi,Helpline text intake,4,1,3,0,4,1,1,I find it difficult to concentrate and keep thinking about the incident.,56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0103,Maharashtra,35-44,Female,Harassment,Bengali,Operator-entered notes,4,1,0,4,1,2,2,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,58.3,50.3,Moderate,Routine review
SYN-NHAA-0104,Gujarat,18-24,Female,Accident/traumatic event,English,Web portal,4,1,3,4,2,4,1,I feel uncomfortable discussing the incident and would like support.,75.0,83.3,78.7,High,Recommended
SYN-NHAA-0105,Odisha,18-24,Female,Cyber harassment,Telugu,Web portal,4,3,1,1,0,0,0,I feel mostly okay now but would like information about available support.,50.0,8.3,31.2,Low,Routine review
SYN-NHAA-0106,Karnataka,55+,Male,Community/social conflict,English,Web portal,0,3,4,2,0,0,2,I feel uncomfortable discussing the incident and would like support.,43.8,16.7,31.6,Low,Routine review
SYN-NHAA-0107,Maharashtra,25-34,Female,Workplace issue,Malayalam,Operator-entered notes,0,1,2,0,1,4,1,I have been feeling worried since the incident and my sleep has been affected.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0108,Kerala,25-34,Prefer not to say,Harassment,Malayalam,Web portal,1,0,0,3,4,0,0,I feel uncomfortable discussing the incident and would like support.,6.2,58.3,29.6,Low,Routine review
SYN-NHAA-0109,Delhi,25-34,Male,Community/social conflict,Bengali,Web portal,3,3,3,3,0,2,0,I have been feeling worried since the incident and my sleep has been affected.,68.8,41.7,56.6,Moderate,Routine review
SYN-NHAA-0110,Tamil Nadu,25-34,Male,Cyber harassment,Kannada,Web portal,2,2,1,1,3,2,1,I feel mostly okay now but would like information about available support.,43.8,50.0,46.6,Moderate,Routine review
SYN-NHAA-0111,Andhra Pradesh,25-34,Male,Financial fraud,Kannada,Web portal,4,0,1,4,4,0,4,I find it difficult to concentrate and keep thinking about the incident.,31.2,66.7,47.2,Moderate,Routine review
SYN-NHAA-0112,Uttar Pradesh,55+,Female,Workplace issue,Kannada,Web portal,1,0,1,3,3,3,0,"I am able to manage most activities, but I still feel stressed about what happened.",31.2,75.0,50.9,Moderate,Routine review
SYN-NHAA-0113,Gujarat,25-34,Male,Other,Telugu,Helpline text intake,3,2,3,3,4,4,0,"I am able to manage most activities, but I still feel stressed about what happened.",75.0,91.7,82.5,High,Recommended
SYN-NHAA-0114,Andhra Pradesh,25-34,Male,Cyber harassment,Bengali,Operator-entered notes,1,3,2,3,3,0,0,I feel uncomfortable discussing the incident and would like support.,37.5,50.0,43.1,Moderate,Routine review
SYN-NHAA-0115,Telangana,35-44,Female,Community/social conflict,Telugu,Web portal,3,3,0,1,0,1,2,I find it difficult to concentrate and keep thinking about the incident.,43.8,16.7,31.6,Low,Routine review
SYN-NHAA-0116,Rajasthan,18-24,Female,Community/social conflict,Tamil,Web portal,1,4,4,3,2,3,0,"I am able to manage most activities, but I still feel stressed about what happened.",75.0,66.7,71.3,High,Recommended
SYN-NHAA-0117,Uttar Pradesh,25-34,Male,Discrimination,Bengali,Helpline text intake,3,2,4,1,0,0,3,I have been feeling worried since the incident and my sleep has been affected.,56.2,8.3,34.6,Low,Routine review
SYN-NHAA-0118,Uttar Pradesh,25-34,Male,Legal dispute,Telugu,Web portal,4,4,1,4,0,4,2,"I am able to manage most activities, but I still feel stressed about what happened.",81.2,66.7,74.7,High,Recommended
SYN-NHAA-0119,Kerala,55+,Female,Workplace issue,Hindi,Helpline text intake,1,2,3,0,0,0,2,I have been feeling worried since the incident and my sleep has been affected.,37.5,0.0,20.6,Low,Routine review
SYN-NHAA-0120,Delhi,55+,Female,Harassment,Bengali,Operator-entered notes,1,4,2,1,2,2,1,"I am able to manage most activities, but I still feel stressed about what happened.",56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0121,Gujarat,35-44,Female,Other,Hindi,Web portal,3,4,4,4,4,3,2,I find it difficult to concentrate and keep thinking about the incident.,87.5,91.7,89.4,High,Recommended
SYN-NHAA-0122,Odisha,25-34,Male,Financial fraud,Marathi,Web portal,3,1,3,0,3,0,0,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,25.0,35.3,Moderate,Routine review
SYN-NHAA-0123,Gujarat,25-34,Female,Discrimination,Malayalam,Operator-entered notes,4,3,1,2,2,1,2,I have been feeling worried since the incident and my sleep has been affected.,56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0124,Tamil Nadu,25-34,Male,Legal dispute,Telugu,Web portal,2,1,4,2,2,0,2,I feel uncomfortable discussing the incident and would like support.,43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0125,Andhra Pradesh,55+,Male,Financial fraud,English,Operator-entered notes,1,3,3,1,0,0,0,I have been feeling worried since the incident and my sleep has been affected.,43.8,8.3,27.8,Low,Routine review
SYN-NHAA-0126,Tamil Nadu,25-34,Prefer not to say,Workplace issue,Hindi,Web portal,1,3,2,4,2,2,3,I find it difficult to concentrate and keep thinking about the incident.,50.0,66.7,57.5,Moderate,Routine review
SYN-NHAA-0127,Telangana,18-24,Female,Other,Kannada,Helpline text intake,3,3,1,2,0,1,2,I find it difficult to concentrate and keep thinking about the incident.,50.0,25.0,38.8,Moderate,Routine review
SYN-NHAA-0128,Rajasthan,35-44,Female,Community/social conflict,Hindi,Web portal,2,3,2,4,0,0,4,I find it difficult to concentrate and keep thinking about the incident.,43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0129,Maharashtra,25-34,Female,Other,Bengali,Web portal,2,1,0,4,3,0,2,I find it difficult to concentrate and keep thinking about the incident.,18.8,58.3,36.6,Moderate,Routine review
SYN-NHAA-0130,Kerala,45-54,Female,Legal dispute,Telugu,Helpline text intake,2,1,3,4,0,4,0,I feel uncomfortable discussing the incident and would like support.,62.5,66.7,64.4,Moderate,Recommended
SYN-NHAA-0131,West Bengal,18-24,Female,Accident/traumatic event,English,Helpline text intake,1,0,3,1,1,0,2,I find it difficult to concentrate and keep thinking about the incident.,25.0,16.7,21.3,Low,Routine review
SYN-NHAA-0132,Delhi,25-34,Male,Harassment,Bengali,Helpline text intake,1,3,4,4,1,0,0,I have been feeling worried since the incident and my sleep has been affected.,50.0,41.7,46.3,Moderate,Routine review
SYN-NHAA-0133,Rajasthan,35-44,Male,Other,Marathi,Helpline text intake,0,1,4,1,0,0,1,I have been feeling worried since the incident and my sleep has been affected.,31.2,8.3,20.9,Low,Routine review
SYN-NHAA-0134,Karnataka,35-44,Male,Workplace issue,Telugu,Web portal,0,4,3,3,4,4,3,I have been feeling worried since the incident and my sleep has been affected.,68.8,91.7,79.1,High,Recommended
SYN-NHAA-0135,Odisha,35-44,Female,Legal dispute,Kannada,Web portal,4,0,2,4,2,4,3,I feel mostly okay now but would like information about available support.,62.5,83.3,71.9,High,Recommended
SYN-NHAA-0136,Odisha,55+,Male,Workplace issue,Tamil,Helpline text intake,0,4,2,1,3,3,0,I have been feeling worried since the incident and my sleep has been affected.,56.2,58.3,57.1,Moderate,Routine review
SYN-NHAA-0137,Rajasthan,35-44,Male,Legal dispute,English,Operator-entered notes,0,3,1,4,1,3,4,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,66.7,54.1,Moderate,Routine review
SYN-NHAA-0138,Uttar Pradesh,35-44,Male,Legal dispute,Hindi,Web portal,3,3,0,1,0,3,3,I feel uncomfortable discussing the incident and would like support.,56.2,33.3,45.9,Moderate,Routine review
SYN-NHAA-0139,Rajasthan,25-34,Male,Domestic conflict,Tamil,Web portal,2,1,1,2,3,2,2,I have been feeling worried since the incident and my sleep has been affected.,37.5,58.3,46.9,Moderate,Routine review
SYN-NHAA-0140,Andhra Pradesh,18-24,Prefer not to say,Legal dispute,Bengali,Operator-entered notes,2,4,2,1,2,0,2,I find it difficult to concentrate and keep thinking about the incident.,50.0,25.0,38.8,Moderate,Routine review
SYN-NHAA-0141,Karnataka,25-34,Female,Community/social conflict,Bengali,Helpline text intake,0,4,1,4,3,4,3,I have been feeling worried since the incident and my sleep has been affected.,56.2,91.7,72.2,High,Recommended
SYN-NHAA-0142,Maharashtra,25-34,Male,Accident/traumatic event,Kannada,Web portal,4,0,4,3,1,2,3,I have been feeling worried since the incident and my sleep has been affected.,62.5,50.0,56.9,Moderate,Routine review
SYN-NHAA-0143,Kerala,18-24,Female,Financial fraud,Telugu,Web portal,1,0,1,1,1,2,1,"I am able to manage most activities, but I still feel stressed about what happened.",25.0,33.3,28.7,Low,Routine review
SYN-NHAA-0144,Maharashtra,25-34,Male,Cyber harassment,Tamil,Helpline text intake,2,1,4,3,0,0,3,I find it difficult to concentrate and keep thinking about the incident.,43.8,25.0,35.3,Moderate,Routine review
SYN-NHAA-0145,West Bengal,35-44,Female,Harassment,Malayalam,Helpline text intake,4,0,0,3,0,3,0,I feel mostly okay now but would like information about available support.,43.8,50.0,46.6,Moderate,Routine review
SYN-NHAA-0146,Kerala,25-34,Male,Community/social conflict,Malayalam,Web portal,0,4,1,0,3,2,4,I find it difficult to concentrate and keep thinking about the incident.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0147,Gujarat,25-34,Male,Accident/traumatic event,Telugu,Helpline text intake,3,3,4,3,3,4,2,"I am able to manage most activities, but I still feel stressed about what happened.",87.5,83.3,85.6,High,Recommended
SYN-NHAA-0148,Odisha,55+,Female,Cyber harassment,English,Web portal,3,3,2,3,2,3,4,I feel mostly okay now but would like information about available support.,68.8,66.7,67.9,High,Recommended
SYN-NHAA-0149,Uttar Pradesh,35-44,Male,Financial fraud,Marathi,Helpline text intake,2,4,4,4,4,3,3,I have been feeling worried since the incident and my sleep has been affected.,81.2,91.7,85.9,High,Recommended
SYN-NHAA-0150,West Bengal,18-24,Female,Accident/traumatic event,Telugu,Web portal,1,0,1,4,1,0,1,I feel uncomfortable discussing the incident and would like support.,12.5,41.7,25.6,Low,Routine review
SYN-NHAA-0151,Delhi,25-34,Male,Financial fraud,English,Operator-entered notes,4,3,4,0,1,0,3,I have been feeling worried since the incident and my sleep has been affected.,68.8,8.3,41.6,Moderate,Routine review
SYN-NHAA-0152,Karnataka,18-24,Male,Harassment,Tamil,Helpline text intake,0,3,1,3,0,0,0,"I am able to manage most activities, but I still feel stressed about what happened.",25.0,25.0,25.0,Low,Routine review
SYN-NHAA-0153,Odisha,35-44,Male,Financial fraud,Malayalam,Web portal,3,4,2,2,0,3,0,I have been feeling worried since the incident and my sleep has been affected.,75.0,41.7,60.0,Moderate,Routine review
SYN-NHAA-0154,Delhi,35-44,Female,Accident/traumatic event,Bengali,Web portal,1,1,4,2,0,0,3,I have been feeling worried since the incident and my sleep has been affected.,37.5,16.7,28.1,Low,Routine review
SYN-NHAA-0155,Delhi,18-24,Male,Accident/traumatic event,Malayalam,Web portal,0,4,1,3,0,4,0,"I am able to manage most activities, but I still feel stressed about what happened.",56.2,58.3,57.1,Moderate,Routine review
SYN-NHAA-0156,Andhra Pradesh,35-44,Female,Community/social conflict,Telugu,Web portal,4,2,4,3,1,3,0,I feel uncomfortable discussing the incident and would like support.,81.2,58.3,70.9,High,Recommended
SYN-NHAA-0157,Kerala,18-24,Female,Domestic conflict,Tamil,Web portal,3,1,3,1,0,1,0,I feel mostly okay now but would like information about available support.,50.0,16.7,35.0,Moderate,Routine review
SYN-NHAA-0158,Andhra Pradesh,45-54,Female,Harassment,Tamil,Web portal,4,4,2,0,1,4,0,I feel uncomfortable discussing the incident and would like support.,87.5,41.7,66.9,High,Recommended
SYN-NHAA-0159,Tamil Nadu,18-24,Female,Financial fraud,Bengali,Web portal,4,2,0,4,0,1,4,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0160,Rajasthan,45-54,Male,Workplace issue,Telugu,Web portal,0,4,4,1,4,1,4,I feel uncomfortable discussing the incident and would like support.,56.2,50.0,53.4,Moderate,Routine review
SYN-NHAA-0161,Rajasthan,25-34,Male,Other,Hindi,Helpline text intake,4,4,3,4,1,2,0,I feel uncomfortable discussing the incident and would like support.,81.2,58.3,70.9,High,Recommended
SYN-NHAA-0162,Andhra Pradesh,45-54,Female,Other,Bengali,Helpline text intake,2,2,1,4,2,3,2,I have been feeling worried since the incident and my sleep has been affected.,50.0,75.0,61.2,Moderate,Routine review
SYN-NHAA-0163,Andhra Pradesh,45-54,Female,Discrimination,Kannada,Operator-entered notes,3,3,2,0,3,0,3,I find it difficult to concentrate and keep thinking about the incident.,50.0,25.0,38.8,Moderate,Routine review
SYN-NHAA-0164,Karnataka,25-34,Non-binary/Other,Other,Tamil,Helpline text intake,4,4,2,3,1,4,2,I find it difficult to concentrate and keep thinking about the incident.,87.5,66.7,78.1,High,Recommended
SYN-NHAA-0165,Andhra Pradesh,25-34,Female,Domestic conflict,Telugu,Helpline text intake,1,2,1,4,3,3,3,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,83.3,61.6,Moderate,Routine review
SYN-NHAA-0166,Andhra Pradesh,25-34,Female,Domestic conflict,Malayalam,Web portal,1,0,4,0,0,1,0,"I am able to manage most activities, but I still feel stressed about what happened.",37.5,8.3,24.4,Low,Routine review
SYN-NHAA-0167,Telangana,18-24,Male,Other,English,Operator-entered notes,1,4,4,2,3,4,4,I have been feeling worried since the incident and my sleep has been affected.,81.2,75.0,78.4,High,Recommended
SYN-NHAA-0168,Kerala,55+,Female,Accident/traumatic event,Telugu,Operator-entered notes,2,2,2,0,4,2,1,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,50.0,50.0,Moderate,Routine review
SYN-NHAA-0169,Telangana,45-54,Female,Cyber harassment,Telugu,Web portal,4,3,4,3,2,0,1,I feel mostly okay now but would like information about available support.,68.8,41.7,56.6,Moderate,Routine review
SYN-NHAA-0170,Rajasthan,45-54,Male,Financial fraud,Hindi,Web portal,3,0,1,0,4,3,3,I find it difficult to concentrate and keep thinking about the incident.,43.8,58.3,50.3,Moderate,Routine review
SYN-NHAA-0171,Maharashtra,35-44,Prefer not to say,Domestic conflict,Marathi,Web portal,0,2,4,1,2,1,0,"I am able to manage most activities, but I still feel stressed about what happened.",43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0172,Odisha,18-24,Male,Accident/traumatic event,Bengali,Operator-entered notes,3,4,4,0,1,3,0,I find it difficult to concentrate and keep thinking about the incident.,87.5,33.3,63.1,Moderate,Routine review
SYN-NHAA-0173,Gujarat,18-24,Male,Domestic conflict,Tamil,Operator-entered notes,4,3,4,1,3,4,1,I feel mostly okay now but would like information about available support.,93.8,66.7,81.6,High,Recommended
SYN-NHAA-0174,Karnataka,25-34,Male,Domestic conflict,Hindi,Operator-entered notes,2,1,0,2,3,2,2,I find it difficult to concentrate and keep thinking about the incident.,31.2,58.3,43.4,Moderate,Routine review
SYN-NHAA-0175,Delhi,18-24,Male,Financial fraud,Kannada,Web portal,0,1,1,2,2,0,2,I have been feeling worried since the incident and my sleep has been affected.,12.5,33.3,21.9,Low,Routine review
SYN-NHAA-0176,Andhra Pradesh,25-34,Male,Discrimination,English,Helpline text intake,1,4,3,3,0,1,1,I find it difficult to concentrate and keep thinking about the incident.,56.2,33.3,45.9,Moderate,Routine review
SYN-NHAA-0177,Odisha,45-54,Female,Accident/traumatic event,Bengali,Web portal,2,1,1,2,1,1,3,I feel uncomfortable discussing the incident and would like support.,31.2,33.3,32.1,Low,Routine review
SYN-NHAA-0178,Kerala,18-24,Male,Accident/traumatic event,English,Helpline text intake,1,1,2,4,0,3,1,I feel uncomfortable discussing the incident and would like support.,43.8,58.3,50.3,Moderate,Routine review
SYN-NHAA-0179,West Bengal,35-44,Non-binary/Other,Workplace issue,Malayalam,Web portal,3,0,1,3,2,0,0,I find it difficult to concentrate and keep thinking about the incident.,25.0,41.7,32.5,Low,Routine review
SYN-NHAA-0180,Odisha,25-34,Male,Financial fraud,Telugu,Helpline text intake,3,3,3,4,4,1,2,I find it difficult to concentrate and keep thinking about the incident.,62.5,75.0,68.1,High,Recommended
SYN-NHAA-0181,Gujarat,25-34,Male,Accident/traumatic event,English,Helpline text intake,4,2,0,1,4,0,0,I have been feeling worried since the incident and my sleep has been affected.,37.5,41.7,39.4,Moderate,Routine review
SYN-NHAA-0182,Odisha,25-34,Female,Accident/traumatic event,English,Web portal,3,1,4,3,3,1,2,I feel mostly okay now but would like information about available support.,56.2,58.3,57.1,Moderate,Routine review
SYN-NHAA-0183,Kerala,45-54,Prefer not to say,Legal dispute,Malayalam,Helpline text intake,4,0,2,2,4,2,3,I feel mostly okay now but would like information about available support.,50.0,66.7,57.5,Moderate,Routine review
SYN-NHAA-0184,Tamil Nadu,45-54,Male,Cyber harassment,English,Helpline text intake,3,2,3,4,1,4,1,I feel uncomfortable discussing the incident and would like support.,75.0,75.0,75.0,High,Recommended
SYN-NHAA-0185,Rajasthan,25-34,Male,Discrimination,Bengali,Operator-entered notes,0,4,0,0,1,3,2,I find it difficult to concentrate and keep thinking about the incident.,43.8,33.3,39.1,Moderate,Routine review
SYN-NHAA-0186,Tamil Nadu,35-44,Male,Financial fraud,Telugu,Helpline text intake,3,1,0,4,4,4,2,I find it difficult to concentrate and keep thinking about the incident.,50.0,100.0,72.5,High,Recommended
SYN-NHAA-0187,Karnataka,45-54,Prefer not to say,Discrimination,Marathi,Web portal,2,2,4,0,3,0,4,I have been feeling worried since the incident and my sleep has been affected.,50.0,25.0,38.8,Moderate,Routine review
SYN-NHAA-0188,Delhi,45-54,Male,Harassment,Hindi,Web portal,1,0,2,1,3,3,0,I feel uncomfortable discussing the incident and would like support.,37.5,58.3,46.9,Moderate,Routine review
SYN-NHAA-0189,Gujarat,35-44,Female,Community/social conflict,Telugu,Operator-entered notes,2,3,0,0,3,2,0,I have been feeling worried since the incident and my sleep has been affected.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0190,Tamil Nadu,18-24,Male,Cyber harassment,Hindi,Helpline text intake,4,3,4,0,4,3,4,I feel mostly okay now but would like information about available support.,87.5,58.3,74.4,High,Recommended
SYN-NHAA-0191,Andhra Pradesh,35-44,Male,Discrimination,Hindi,Helpline text intake,2,3,4,0,4,4,1,I feel uncomfortable discussing the incident and would like support.,81.2,66.7,74.7,High,Recommended
SYN-NHAA-0192,Delhi,18-24,Male,Financial fraud,Tamil,Operator-entered notes,1,0,1,3,4,0,4,I have been feeling worried since the incident and my sleep has been affected.,12.5,58.3,33.1,Low,Routine review
SYN-NHAA-0193,West Bengal,45-54,Male,Other,Telugu,Web portal,4,2,4,1,1,2,2,I feel uncomfortable discussing the incident and would like support.,75.0,33.3,56.2,Moderate,Routine review
SYN-NHAA-0194,Telangana,18-24,Female,Harassment,Hindi,Helpline text intake,0,3,1,4,3,0,3,"I am able to manage most activities, but I still feel stressed about what happened.",25.0,58.3,40.0,Moderate,Routine review
SYN-NHAA-0195,Delhi,35-44,Female,Workplace issue,Kannada,Helpline text intake,0,4,4,1,3,2,4,I have been feeling worried since the incident and my sleep has been affected.,62.5,50.0,56.9,Moderate,Routine review
SYN-NHAA-0196,Kerala,25-34,Male,Legal dispute,Kannada,Web portal,1,3,1,0,1,3,4,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,33.3,42.5,Moderate,Routine review
SYN-NHAA-0197,Uttar Pradesh,18-24,Female,Cyber harassment,Hindi,Helpline text intake,4,4,3,1,1,2,4,I have been feeling worried since the incident and my sleep has been affected.,81.2,33.3,59.6,Moderate,Routine review
SYN-NHAA-0198,Uttar Pradesh,45-54,Male,Legal dispute,Hindi,Operator-entered notes,1,4,0,2,3,2,1,I have been feeling worried since the incident and my sleep has been affected.,43.8,58.3,50.3,Moderate,Routine review
SYN-NHAA-0199,Kerala,25-34,Female,Cyber harassment,Bengali,Web portal,0,0,2,2,0,4,1,I find it difficult to concentrate and keep thinking about the incident.,37.5,50.0,43.1,Moderate,Routine review
SYN-NHAA-0200,West Bengal,35-44,Male,Workplace issue,Marathi,Helpline text intake,2,3,4,0,4,2,2,I feel mostly okay now but would like information about available support.,68.8,50.0,60.3,Moderate,Routine review
SYN-NHAA-0201,Delhi,35-44,Male,Harassment,English,Operator-entered notes,3,4,0,3,0,4,4,"I am able to manage most activities, but I still feel stressed about what happened.",68.8,58.3,64.1,Moderate,Routine review
SYN-NHAA-0202,Karnataka,25-34,Male,Financial fraud,English,Operator-entered notes,4,3,4,2,2,1,1,I feel mostly okay now but would like information about available support.,75.0,41.7,60.0,Moderate,Routine review
SYN-NHAA-0203,Telangana,35-44,Male,Financial fraud,Hindi,Operator-entered notes,2,3,0,4,3,4,3,I find it difficult to concentrate and keep thinking about the incident.,56.2,91.7,72.2,High,Recommended
SYN-NHAA-0204,Odisha,18-24,Male,Accident/traumatic event,Bengali,Helpline text intake,1,2,0,4,3,1,0,I feel uncomfortable discussing the incident and would like support.,25.0,66.7,43.8,Moderate,Routine review
SYN-NHAA-0205,Andhra Pradesh,18-24,Male,Legal dispute,Hindi,Web portal,0,3,4,0,4,1,4,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,41.7,46.3,Moderate,Routine review
SYN-NHAA-0206,Rajasthan,25-34,Female,Discrimination,Bengali,Web portal,0,2,4,0,4,1,0,I feel mostly okay now but would like information about available support.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0207,West Bengal,25-34,Female,Legal dispute,Hindi,Web portal,1,4,2,0,4,4,2,I find it difficult to concentrate and keep thinking about the incident.,68.8,66.7,67.9,High,Recommended
SYN-NHAA-0208,Rajasthan,35-44,Female,Legal dispute,Hindi,Web portal,0,0,0,0,3,3,3,I feel uncomfortable discussing the incident and would like support.,18.8,50.0,32.8,Low,Routine review
SYN-NHAA-0209,Karnataka,25-34,Female,Financial fraud,Telugu,Web portal,3,3,1,2,3,0,3,I find it difficult to concentrate and keep thinking about the incident.,43.8,41.7,42.9,Moderate,Routine review
SYN-NHAA-0210,West Bengal,25-34,Prefer not to say,Cyber harassment,English,Helpline text intake,1,0,3,2,2,0,3,I have been feeling worried since the incident and my sleep has been affected.,25.0,33.3,28.7,Low,Routine review
SYN-NHAA-0211,Rajasthan,35-44,Male,Workplace issue,Hindi,Web portal,3,2,0,0,1,4,1,I feel mostly okay now but would like information about available support.,56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0212,Gujarat,25-34,Male,Cyber harassment,Hindi,Web portal,0,1,4,0,0,0,0,I have been feeling worried since the incident and my sleep has been affected.,31.2,0.0,17.2,Low,Routine review
SYN-NHAA-0213,Odisha,18-24,Male,Financial fraud,Telugu,Helpline text intake,4,3,0,4,0,2,0,I feel mostly okay now but would like information about available support.,56.2,50.0,53.4,Moderate,Routine review
SYN-NHAA-0214,Telangana,45-54,Male,Accident/traumatic event,Kannada,Helpline text intake,1,3,3,2,0,3,3,I have been feeling worried since the incident and my sleep has been affected.,62.5,41.7,53.1,Moderate,Routine review
SYN-NHAA-0215,Karnataka,35-44,Female,Legal dispute,Telugu,Web portal,4,4,1,4,1,3,1,I have been feeling worried since the incident and my sleep has been affected.,75.0,66.7,71.3,High,Recommended
SYN-NHAA-0216,Odisha,55+,Non-binary/Other,Harassment,Tamil,Operator-entered notes,2,3,2,1,1,2,2,I feel uncomfortable discussing the incident and would like support.,56.2,33.3,45.9,Moderate,Routine review
SYN-NHAA-0217,Telangana,45-54,Female,Accident/traumatic event,Kannada,Helpline text intake,4,4,4,1,2,4,3,"I am able to manage most activities, but I still feel stressed about what happened.",100.0,58.3,81.2,High,Recommended
SYN-NHAA-0218,West Bengal,35-44,Male,Harassment,Marathi,Web portal,1,0,4,2,1,3,3,I find it difficult to concentrate and keep thinking about the incident.,50.0,50.0,50.0,Moderate,Routine review
SYN-NHAA-0219,Maharashtra,18-24,Male,Discrimination,Bengali,Web portal,3,0,1,2,2,4,0,"I am able to manage most activities, but I still feel stressed about what happened.",50.0,66.7,57.5,Moderate,Routine review
SYN-NHAA-0220,Delhi,25-34,Male,Financial fraud,Telugu,Web portal,4,3,3,1,4,2,0,"I am able to manage most activities, but I still feel stressed about what happened.",75.0,58.3,67.5,High,Recommended
SYN-NHAA-0221,Telangana,18-24,Male,Discrimination,Hindi,Operator-entered notes,2,3,2,4,4,2,2,I find it difficult to concentrate and keep thinking about the incident.,56.2,83.3,68.4,High,Recommended
SYN-NHAA-0222,Uttar Pradesh,35-44,Female,Legal dispute,Kannada,Web portal,0,4,3,0,3,1,0,I feel uncomfortable discussing the incident and would like support.,50.0,33.3,42.5,Moderate,Routine review
SYN-NHAA-0223,Rajasthan,35-44,Male,Legal dispute,Bengali,Web portal,0,3,3,0,0,4,1,I find it difficult to concentrate and keep thinking about the incident.,62.5,33.3,49.4,Moderate,Routine review
SYN-NHAA-0224,Odisha,18-24,Male,Legal dispute,Kannada,Web portal,3,2,0,4,4,1,0,I find it difficult to concentrate and keep thinking about the incident.,37.5,75.0,54.4,Moderate,Routine review
SYN-NHAA-0225,Telangana,35-44,Male,Domestic conflict,Marathi,Helpline text intake,3,2,1,4,1,0,2,I feel uncomfortable discussing the incident and would like support.,37.5,41.7,39.4,Moderate,Routine review
SYN-NHAA-0226,Karnataka,25-34,Male,Accident/traumatic event,Bengali,Helpline text intake,4,2,2,0,4,0,4,I feel uncomfortable discussing the incident and would like support.,50.0,33.3,42.5,Moderate,Routine review
SYN-NHAA-0227,Delhi,25-34,Male,Discrimination,Bengali,Helpline text intake,2,4,4,3,2,0,1,I feel uncomfortable discussing the incident and would like support.,62.5,41.7,53.1,Moderate,Routine review
SYN-NHAA-0228,Tamil Nadu,35-44,Non-binary/Other,Harassment,Bengali,Operator-entered notes,2,3,3,0,4,1,0,I have been feeling worried since the incident and my sleep has been affected.,56.2,41.7,49.7,Moderate,Routine review
SYN-NHAA-0229,Andhra Pradesh,55+,Male,Accident/traumatic event,Kannada,Helpline text intake,3,4,3,4,2,1,3,I feel uncomfortable discussing the incident and would like support.,68.8,58.3,64.1,Moderate,Routine review
SYN-NHAA-0300,Rajasthan,55+,Male,Community/social conflict,Telugu,Web portal,0,3,0,0,1,4,0,I feel mostly okay now but would like information about available support.,43.8,41.7,42.9,Moderate,Routine review"""

def ingest():
    conn = sqlite3.connect('data/app.db')
    cursor = conn.cursor()

    reader = csv.DictReader(io.StringIO(CSV_DATA.strip()))
    cases_inserted = 0
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    for row in reader:
        case_id = row['case_id'].strip()
        state = row['state'].strip()
        district = "District Nodal Headquarter"
        language = row['preferred_language'].strip()
        input_type = row['intake_channel'].strip()
        narrative = row['synthetic_user_text'].strip()
        svi_score = float(row['overall_assessment_score_0_100'])
        risk_category = row['assessment_level'].strip()
        human_review = row['human_review'].strip() == "Recommended" or svi_score >= 65.0
        urgent_safety = svi_score >= 75.0 or risk_category == "High" or risk_category == "Critical"
        status = "NEW" if human_review else "UNDER_REVIEW"

        risk_factors = json.dumps([
            f"Incident Type: {row['incident_type'].strip()}",
            f"Age Group: {row['age_group'].strip()}",
            f"Gender: {row['gender'].strip()}",
            f"Sleep Difficulty: {row['sleep_difficulty_0_4']}/4",
            f"Persistent Worry: {row['persistent_worry_0_4']}/4",
            f"Emotional Distress: {row['emotional_distress_0_4']}/4"
        ])

        # 1. Insert into cases
        cursor.execute("""
            INSERT OR REPLACE INTO cases (
                case_id, svi, risk_category, risk_factors, human_review_required,
                urgent_safety_indicator, status, assigned_to, state, district,
                language, input_type, assessment_mode, narrative_summary, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case_id, int(round(svi_score)), risk_category, risk_factors,
            1 if human_review else 0, 1 if urgent_safety else 0, status,
            "OFFICER-INTAKE-POOL", state, district, language, input_type,
            "synthetic_dataset_import", narrative, now_str, now_str
        ))

        # 2. Insert into interaction_analysis
        emotion_scores = json.dumps({
            "distress": float(row["stress_indicator_score_0_100"]),
            "fear": float(row["fear_or_alarm_0_4"]) * 25.0,
            "anxiety": float(row["persistent_worry_0_4"]) * 25.0,
            "sadness": float(row["emotional_distress_0_4"]) * 25.0,
            "anger": float(row["avoidance_0_4"]) * 25.0
        })
        indicators = json.dumps([
            f"Sleep difficulty ({row['sleep_difficulty_0_4']}/4)",
            f"Persistent worry ({row['persistent_worry_0_4']}/4)",
            f"Concentration issue ({row['concentration_difficulty_0_4']}/4)"
        ])
        trauma_ind = json.dumps([
            f"Trauma score ({row['trauma_indicator_score_0_100']}/100)",
            f"Incident: {row['incident_type'].strip()}"
        ])
        vulnerability_ind = json.dumps([
            f"Support need score ({row['support_need_0_4']}/4)"
        ])
        urgent_safety_ind = json.dumps(["Urgent Safety Triggered"] if urgent_safety else [])
        explainability = json.dumps([{
            "indicator": "Synthetic Intake Survey Score",
            "category": "Dataset Ingestion",
            "confidence": 92.0,
            "matched_term": f"SVI {svi_score}",
            "rationale": f"Synthetic record intake for {row['incident_type']} in {state}."
        }])

        cursor.execute("""
            INSERT INTO interaction_analysis (
                case_id, created_at, language, analysis_type, narrative_excerpt,
                emotion_scores_json, indicators_json, trauma_indicators_json,
                vulnerability_indicators_json, urgent_safety_indicators_json,
                explainability_json, urgent_review, confidence, transcript, consent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case_id, now_str, language, "Text", narrative[:200],
            emotion_scores, indicators, trauma_ind, vulnerability_ind,
            urgent_safety_ind, explainability, 1 if human_review else 0,
            90.0, narrative, 1
        ))

        # 3. Insert into assessments
        cursor.execute("""
            INSERT INTO assessments (
                case_id, svi_score, risk_category, confidence, human_review_required,
                priority, model_version, language, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case_id, svi_score, risk_category, 90.0, 1 if human_review else 0,
            "URGENT" if risk_category in ["High", "Critical"] else "ROUTINE",
            "1.0.0", language, now_str, now_str
        ))

        # 4. Insert into support_actions
        cursor.execute("""
            INSERT INTO support_actions (
                case_id, action_type, priority, status, assigned_to, created_at, updated_at, notes, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case_id, "Helpline Information & Legal Guidance",
            "HIGH" if risk_category in ["High", "Critical"] else "MODERATE",
            "PENDING", "SYSTEM", now_str, now_str,
            f"Automated support pathway for {row['incident_type']} complaint.", "SYNTHETIC_INGEST"
        ))

        cases_inserted += 1

    # 5. Insert Audit Log for Ingestion
    cursor.execute("""
        INSERT INTO audit_logs (
            user_id, role, case_id, action, timestamp, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "SYSTEM_IMPORT", "ADMIN", "BULK-IMPORT-300",
        "BULK_SYNTHETIC_DATASET_INGESTION", now_str,
        json.dumps({"inserted_count": cases_inserted, "source": "NHAA Synthetic Intake CSV"})
    ))

    conn.commit()
    conn.close()
    print(f"Successfully ingested {cases_inserted} synthetic intake cases into data/app.db!")

if __name__ == "__main__":
    ingest()
