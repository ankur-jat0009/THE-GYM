import calendar
from datetime import date, datetime, timedelta, timezone
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.membership import MembershipPlan, Membership
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.models.workout import WorkoutCategory, WorkoutPlan, WorkoutExercise, CustomerWorkoutAssignment
from app.models.notification import Notification


def seed_database():
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin User
        admin_email = "admin@thegym.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                full_name="Gym Administrator",
                email=admin_email,
                phone="9992963807",
                hashed_password=get_password_hash("AdminPassword@123"),
                role="admin",
                is_active=True,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("Created default Admin account: admin@thegym.com / AdminPassword@123")

        # 2. Staff User
        staff_email = "staff@thegym.com"
        staff = db.query(User).filter(User.email == staff_email).first()
        if not staff:
            staff = User(
                full_name="Front Desk Coach",
                email=staff_email,
                phone="9992963808",
                hashed_password=get_password_hash("StaffPassword@123"),
                role="staff",
                is_active=True,
            )
            db.add(staff)
            db.commit()
            db.refresh(staff)
            print("Created default Staff account: staff@thegym.com / StaffPassword@123")

        # 3. Sample Customers
        customers_data = [
            {
                "full_name": "Rahul Sharma",
                "email": "rahul@gmail.com",
                "phone": "9876543210",
                "password": "MemberPassword@123",
                "gender": "Male",
                "dob": date(1996, 5, 14),
            },
            {
                "full_name": "Priya Verma",
                "email": "priya@gmail.com",
                "phone": "9876543211",
                "password": "MemberPassword@123",
                "gender": "Female",
                "dob": date(1999, 9, 22),
            },
            {
                "full_name": "Amit Yadav",
                "email": "amit@gmail.com",
                "phone": "9876543212",
                "password": "MemberPassword@123",
                "gender": "Male",
                "dob": date(1994, 2, 8),
            },
        ]

        seeded_customers = []
        for cdata in customers_data:
            c = db.query(User).filter(User.email == cdata["email"]).first()
            if not c:
                c = User(
                    full_name=cdata["full_name"],
                    email=cdata["email"],
                    phone=cdata["phone"],
                    hashed_password=get_password_hash(cdata["password"]),
                    role="customer",
                    gender=cdata["gender"],
                    date_of_birth=cdata["dob"],
                    is_active=True,
                )
                db.add(c)
                db.commit()
                db.refresh(c)
                print(f"Created customer: {c.email} / {cdata['password']}")
            seeded_customers.append(c)

        # 4. Membership Plans
        plans_data = [
            {
                "name": "Monthly Starter",
                "duration_months": 1,
                "duration_days": 30,
                "price": 1500.0,
                "description": "Essential gym access ideal for beginners beginning their workout journey.",
                "features": [
                    "Complete Gym Floor & Cardio Access",
                    "Strength & Free Weights Zone",
                    "Locker & Shower Facilities",
                    "1 Free Fitness Assessment & Orientation",
                ],
                "is_popular": False,
            },
            {
                "name": "Quarterly Pro",
                "duration_months": 3,
                "duration_days": 90,
                "price": 3800.0,
                "description": "Our most popular membership plan for consistent transformations.",
                "features": [
                    "Full Gym & Conditioning Area Access",
                    "Custom Workout Plan Assistance",
                    "Body Composition & Progress Tracking",
                    "Priority Locker Access",
                    "Diet & Nutrition Guidance Sheet",
                ],
                "is_popular": True,
            },
            {
                "name": "Half-Yearly Elite",
                "duration_months": 6,
                "duration_days": 180,
                "price": 6500.0,
                "description": "Substantial commitment with maximum savings and premium perks.",
                "features": [
                    "All Quarterly Pro Features Included",
                    "Bi-Weekly Progress & Measurement Review",
                    "1 Free Guest Workout Pass Per Month",
                    "Complimentary THE GYM Shaker",
                ],
                "is_popular": False,
            },
            {
                "name": "Annual Champion",
                "duration_months": 12,
                "duration_days": 365,
                "price": 11000.0,
                "description": "The ultimate 365-day fitness journey with best value per month.",
                "features": [
                    "Unrestricted 365-Day Gym Access",
                    "Free Membership Freeze Option (Up to 30 Days)",
                    "Comprehensive Form & Technique Coaching",
                    "Exclusive THE GYM Apparel & Shaker",
                    "Dedicated Locker Preference",
                ],
                "is_popular": False,
            },
        ]

        seeded_plans = []
        for pdata in plans_data:
            p = db.query(MembershipPlan).filter(MembershipPlan.name == pdata["name"]).first()
            if not p:
                p = MembershipPlan(
                    name=pdata["name"],
                    duration_months=pdata["duration_months"],
                    duration_days=pdata["duration_days"],
                    price=pdata["price"],
                    description=pdata["description"],
                    is_popular=pdata["is_popular"],
                    is_active=True,
                )
                p.features = pdata["features"]
                db.add(p)
                db.commit()
                db.refresh(p)
                print(f"Created membership plan: {p.name}")
            seeded_plans.append(p)

        # 5. Workout Categories
        categories_data = [
            {
                "name": "Fat Loss",
                "slug": "fat-loss",
                "description": "High-metabolic circuit training, steady-state cardio, and calorie-burning hypertrophy routines.",
                "display_order": 1,
            },
            {
                "name": "Muscle Gain",
                "slug": "muscle-gain",
                "description": "Classic progressive overload bodybuilding splits designed for maximum hypertrophy and muscle volume.",
                "display_order": 2,
            },
            {
                "name": "Strength Training",
                "slug": "strength-training",
                "description": "Heavy compound lifts, power building, and central nervous system conditioning.",
                "display_order": 3,
            },
            {
                "name": "General Fitness",
                "slug": "general-fitness",
                "description": "Balanced cardiovascular endurance, mobility, functional strength, and overall wellness.",
                "display_order": 4,
            },
            {
                "name": "Beginner Workout",
                "slug": "beginner-workout",
                "description": "Fundamental exercise mechanics, machine introductions, and posture development for newcomers.",
                "display_order": 5,
            },
        ]

        seeded_categories = {}
        for cdata in categories_data:
            cat = db.query(WorkoutCategory).filter(WorkoutCategory.slug == cdata["slug"]).first()
            if not cat:
                cat = WorkoutCategory(
                    name=cdata["name"],
                    slug=cdata["slug"],
                    description=cdata["description"],
                    display_order=cdata["display_order"],
                )
                db.add(cat)
                db.commit()
                db.refresh(cat)
                print(f"Created workout category: {cat.name}")
            seeded_categories[cat.slug] = cat

        # 6. Workout Plans and Exercises for all 5 Categories
        plans_and_exercises = [
            {
                "category_slug": "fat-loss",
                "title": "Metabolic Fat Shred & Conditioning (4-Day Split)",
                "difficulty": "Intermediate",
                "duration_weeks": 6,
                "description": "High-EPOC compound resistance intervals paired with short rest periods to burn maximum calories while preserving muscle.",
                "exercises": [
                    {"day": "Day 1: Full Body Metabolic", "name": "Barbell Conventional Deadlifts", "sets": 4, "reps": "8 reps", "rest": 60, "inst": "Drive through heels, brace core tightly, and maintain neutral spine."},
                    {"day": "Day 1: Full Body Metabolic", "name": "Dumbbell Goblet Squats", "sets": 4, "reps": "12 reps", "rest": 45, "inst": "Descend deep with chest upright and knees tracking over toes."},
                    {"day": "Day 1: Full Body Metabolic", "name": "Incline Dumbbell Chest Press", "sets": 3, "reps": "10-12 reps", "rest": 45, "inst": "Keep continuous tension on upper chest without resting at lockout."},
                    {"day": "Day 2: HIIT & Calorie Burn", "name": "Kettlebell Power Swings", "sets": 4, "reps": "15-20 reps", "rest": 30, "inst": "Hinge forcefully at hips, snap glutes tight at peak."},
                    {"day": "Day 2: HIIT & Calorie Burn", "name": "Dumbbell Renegade Rows", "sets": 3, "reps": "12 reps/side", "rest": 45, "inst": "Plank position, row dumbbell to pocket without rotating hips."},
                    {"day": "Day 2: HIIT & Calorie Burn", "name": "Treadmill High Incline Sprints", "sets": 8, "reps": "30s sprint / 30s rest", "rest": 30, "inst": "Run at 85% effort on high incline for post-exercise oxygen burn."},
                ],
            },
            {
                "category_slug": "muscle-gain",
                "title": "Push-Pull-Legs Hypertrophy Protocol (6-Day Split)",
                "difficulty": "Intermediate",
                "duration_weeks": 8,
                "description": "Scientifically proven Push-Pull-Legs split delivering optimal weekly training volume and progressive overload for muscle growth.",
                "exercises": [
                    {"day": "Day 1: Push (Chest, Delts, Triceps)", "name": "Barbell Flat Bench Press", "sets": 4, "reps": "6-8 reps", "rest": 90, "inst": "Retract scapulae, touch lower sternum with control, press explosively."},
                    {"day": "Day 1: Push (Chest, Delts, Triceps)", "name": "Incline Dumbbell Press", "sets": 3, "reps": "8-10 reps", "rest": 60, "inst": "30 degree bench angle, deep stretch and full squeeze at contraction."},
                    {"day": "Day 1: Push (Chest, Delts, Triceps)", "name": "Dumbbell Lateral Raises", "sets": 4, "reps": "12-15 reps", "rest": 45, "inst": "Lead with elbows, pause 1s at parallel to sculpt medial deltoid."},
                    {"day": "Day 2: Pull (Back & Biceps)", "name": "Lat Pulldown (Wide Neutral Grip)", "sets": 4, "reps": "8-10 reps", "rest": 75, "inst": "Drive elbows downwards towards back pockets to engage lower lats."},
                    {"day": "Day 2: Pull (Back & Biceps)", "name": "Seated Cable Rows", "sets": 3, "reps": "10-12 reps", "rest": 60, "inst": "Retract shoulder blades fully, pull handle directly into abdomen."},
                    {"day": "Day 2: Pull (Back & Biceps)", "name": "Standing Incline Dumbbell Curls", "sets": 3, "reps": "10-12 reps", "rest": 45, "inst": "Supinate wrists at top for maximum peak bicep contraction."},
                    {"day": "Day 3: Legs & Core", "name": "Barbell Back Squats", "sets": 4, "reps": "6-8 reps", "rest": 120, "inst": "Parallel depth, maintain abdominal brace and upright torso."},
                    {"day": "Day 3: Legs & Core", "name": "Romanian Deadlifts (RDLs)", "sets": 3, "reps": "8-10 reps", "rest": 90, "inst": "Hips travel back, stretch hamstrings, maintain tight upper back."},
                    {"day": "Day 3: Legs & Core", "name": "Standing Calf Raises & Hanging Knee Raises", "sets": 3, "reps": "15 reps", "rest": 45, "inst": "Full ankle plantarflexion and controlled pelvic tilt."},
                ],
            },
            {
                "category_slug": "strength-training",
                "title": "5x5 Linear Compound Power Protocol",
                "difficulty": "Advanced",
                "duration_weeks": 10,
                "description": "Gold-standard 5x5 compound barbell progression targeting maximal raw strength, nervous system recruitment, and bone density.",
                "exercises": [
                    {"day": "Day 1: Heavy Squat & Bench", "name": "Low-Bar Barbell Squats", "sets": 5, "reps": "5 reps", "rest": 180, "inst": "Rest 3 mins between heavy sets. Drive hips explosively out of the hole."},
                    {"day": "Day 1: Heavy Squat & Bench", "name": "Flat Barbell Bench Press", "sets": 5, "reps": "5 reps", "rest": 180, "inst": "Firm leg drive, tucked elbows, lower bar steadily to touch sternum."},
                    {"day": "Day 1: Heavy Squat & Bench", "name": "Pendlay Barbell Rows", "sets": 5, "reps": "5 reps", "rest": 120, "inst": "Deload barbell on floor each repetition, pull violently into upper abs."},
                    {"day": "Day 2: Deadlift & Overhead Press", "name": "Conventional Barbell Deadlifts", "sets": 3, "reps": "5 heavy reps", "rest": 180, "inst": "Lock lats, wedge hips into bar, stand tall without leaning back."},
                    {"day": "Day 2: Deadlift & Overhead Press", "name": "Standing Overhead Press (OHP)", "sets": 5, "reps": "5 reps", "rest": 180, "inst": "Clear face, press directly upward, lock out vertically over crown."},
                    {"day": "Day 3: Power Accessories", "name": "Weighted Pull-Ups or Heavy Dips", "sets": 4, "reps": "6-8 reps", "rest": 90, "inst": "Full stretch at bottom, explosive chin over bar with zero swing."},
                ],
            },
            {
                "category_slug": "general-fitness",
                "title": "Functional Health, Mobility & Longevity Split",
                "difficulty": "All Levels",
                "duration_weeks": 8,
                "description": "Balanced routine emphasizing cardiovascular conditioning, joint mobility, posture correction, and whole-body vitality.",
                "exercises": [
                    {"day": "Day 1: Functional Upper Body", "name": "Dumbbell Neutral-Grip Incline Press", "sets": 3, "reps": "10-12 reps", "rest": 60, "inst": "Joint-friendly neutral grip, smooth cadence and controlled negative."},
                    {"day": "Day 1: Functional Upper Body", "name": "One-Arm Dumbbell Rows", "sets": 3, "reps": "10 reps/side", "rest": 60, "inst": "Isolate upper back musculature without spinal stress."},
                    {"day": "Day 2: Mobility & Lower Body", "name": "Kettlebell Goblet Squats", "sets": 3, "reps": "12 reps", "rest": 60, "inst": "Deep comfortable squat depth to mobilize hip and ankle joints."},
                    {"day": "Day 2: Mobility & Lower Body", "name": "Bodyweight Walking Lunges", "sets": 3, "reps": "12 steps/leg", "rest": 45, "inst": "Maintain upright posture, rear knee softly touches floor."},
                    {"day": "Day 3: Core & Cardiovascular", "name": "Plank to Downward Dog & Bird-Dog", "sets": 3, "reps": "10 reps", "rest": 45, "inst": "Cross-body stability pattern to strengthen posterior spinal sling."},
                    {"day": "Day 3: Core & Cardiovascular", "name": "Zone 2 Steady State Cardio (Cycle/Incline)", "sets": 1, "reps": "25-30 minutes", "rest": 0, "inst": "Conversational pace at 65-70% max heart rate for aerobic base."},
                ],
            },
            {
                "category_slug": "beginner-workout",
                "title": "Foundational 3-Day Full Body Kickstart",
                "difficulty": "Beginner",
                "duration_weeks": 4,
                "description": "Safe, confidence-building introduction to essential gym machines, posture alignment, and motor mechanics.",
                "exercises": [
                    {"day": "Day 1: Machine Foundations", "name": "Seated Machine Chest Press", "sets": 3, "reps": "10-12 reps", "rest": 60, "inst": "Adjust seat height to mid-chest level. Smooth rhythmic cadence."},
                    {"day": "Day 1: Machine Foundations", "name": "Seated Cable Lat Pulldown", "sets": 3, "reps": "10-12 reps", "rest": 60, "inst": "Wide grip, upright posture, pull bar smoothly down to collarbone."},
                    {"day": "Day 2: Lower Body Basics", "name": "Seated Leg Press Machine", "sets": 3, "reps": "10-12 reps", "rest": 75, "inst": "Feet shoulder-width apart, knees track in line with toes, avoid knee lockout."},
                    {"day": "Day 2: Lower Body Basics", "name": "Seated Hamstring Leg Curls", "sets": 3, "reps": "12 reps", "rest": 60, "inst": "Curl legs smoothly under bench, pause 1s, return with control."},
                    {"day": "Day 3: Arms & Core Alignment", "name": "Standing Dumbbell Bicep Curls", "sets": 3, "reps": "12 reps", "rest": 45, "inst": "Upper arms pinned to sides, curl without torso swinging."},
                    {"day": "Day 3: Arms & Core Alignment", "name": "Isometric Forearm Plank Hold", "sets": 3, "reps": "30-45 seconds", "rest": 45, "inst": "Solid straight line from head to heels, glutes and abs tight."},
                ],
            },
        ]

        created_workout_plans = []
        for pinfo in plans_and_exercises:
            cat = seeded_categories.get(pinfo["category_slug"])
            if cat:
                wp = db.query(WorkoutPlan).filter(WorkoutPlan.title == pinfo["title"]).first()
                if not wp:
                    wp = WorkoutPlan(
                        category_id=cat.id,
                        title=pinfo["title"],
                        description=pinfo["description"],
                        difficulty_level=pinfo["difficulty"],
                        duration_weeks=pinfo["duration_weeks"],
                        is_active=True,
                    )
                    db.add(wp)
                    db.commit()
                    db.refresh(wp)

                    for idx, ex in enumerate(pinfo["exercises"]):
                        we = WorkoutExercise(
                            plan_id=wp.id,
                            day_name=ex["day"],
                            exercise_name=ex["name"],
                            sets=ex["sets"],
                            reps=ex["reps"],
                            rest_seconds=ex["rest"],
                            instructions=ex["inst"],
                            display_order=idx,
                        )
                        db.add(we)
                    db.commit()
                    print(f"Created workout plan: {wp.title}")
                created_workout_plans.append(wp)

        # 7. Assign Memberships & Payments to sample customers
        today = date.today()
        # Rahul: Quarterly Pro (Active, fully paid)
        rahul = seeded_customers[0]
        q_plan = seeded_plans[1]  # Quarterly Pro
        rahul_m = db.query(Membership).filter(Membership.user_id == rahul.id).first()
        if not rahul_m:
            rahul_m = Membership(
                user_id=rahul.id,
                plan_id=q_plan.id,
                start_date=today - timedelta(days=20),
                end_date=today + timedelta(days=70),
                total_amount=q_plan.price,
                discount_amount=0.0,
                final_amount=q_plan.price,
                status="active",
                notes="Joined via Spring Promotion",
            )
            db.add(rahul_m)
            db.commit()
            db.refresh(rahul_m)

            # Payment
            p1 = Payment(
                membership_id=rahul_m.id,
                user_id=rahul.id,
                amount=q_plan.price,
                payment_date=today - timedelta(days=20),
                payment_method="UPI",
                transaction_reference="UPI/RAHUL/9876543210/OKAXIS",
                receipt_number="TG-20261010-1001",
                remarks="Full quarterly payment via GPay",
                created_by_id=admin.id,
            )
            db.add(p1)
            db.commit()

        # Priya: Monthly Starter (Active, partial fee remaining)
        priya = seeded_customers[1]
        m_plan = seeded_plans[0]  # Monthly Starter
        priya_m = db.query(Membership).filter(Membership.user_id == priya.id).first()
        if not priya_m:
            priya_m = Membership(
                user_id=priya.id,
                plan_id=m_plan.id,
                start_date=today - timedelta(days=10),
                end_date=today + timedelta(days=20),
                total_amount=m_plan.price,
                discount_amount=0.0,
                final_amount=m_plan.price,
                status="active",
                notes="Student membership",
            )
            db.add(priya_m)
            db.commit()
            db.refresh(priya_m)

            # Partial payment: paid 1000, 500 pending
            p2 = Payment(
                membership_id=priya_m.id,
                user_id=priya.id,
                amount=1000.0,
                payment_date=today - timedelta(days=10),
                payment_method="CASH",
                transaction_reference=None,
                receipt_number="TG-20261020-1002",
                remarks="Partial cash advance; balance ₹500 due next week",
                created_by_id=admin.id,
            )
            db.add(p2)
            db.commit()

        # Amit: Half-Yearly Elite (Active, fully paid)
        amit = seeded_customers[2]
        h_plan = seeded_plans[2]  # Half-Yearly Elite
        amit_m = db.query(Membership).filter(Membership.user_id == amit.id).first()
        if not amit_m:
            amit_total = float(h_plan.price)
            amit_discount = 500.0
            amit_final = amit_total - amit_discount
            amit_m = Membership(
                user_id=amit.id,
                plan_id=h_plan.id,
                start_date=today - timedelta(days=45),
                end_date=today + timedelta(days=135),
                total_amount=amit_total,
                discount_amount=amit_discount,
                final_amount=amit_final,
                status="active",
                notes="Special referral discount applied",
            )
            db.add(amit_m)
            db.commit()
            db.refresh(amit_m)

            p3 = Payment(
                membership_id=amit_m.id,
                user_id=amit.id,
                amount=amit_final,
                payment_date=today - timedelta(days=45),
                payment_method="BANK_TRANSFER",
                transaction_reference="NEFT-HDFC-9921448",
                receipt_number="TG-20260915-1003",
                remarks="Online NEFT transfer confirmed",
                created_by_id=admin.id,
            )
            db.add(p3)
            db.commit()

        # 8. Seed Attendance Logs for current month so calendar is populated
        for customer in seeded_customers:
            # Check in on selected days of current month
            num_days_to_seed = 12 if customer == rahul else (8 if customer == priya else 14)
            for d in range(1, min(today.day + 1, num_days_to_seed)):
                check_date = date(today.year, today.month, d)
                exists = db.query(Attendance).filter(Attendance.user_id == customer.id, Attendance.attendance_date == check_date).first()
                if not exists:
                    att = Attendance(
                        user_id=customer.id,
                        attendance_date=check_date,
                        check_in_time=datetime.combine(check_date, datetime.min.time()) + timedelta(hours=7, minutes=30 + d),
                        marked_by_id=admin.id,
                        method="QR_SCAN",
                        notes="QR Check-in at main gate",
                    )
                    db.add(att)
            db.commit()

        # 9. Assign Workout Plan to Rahul
        if created_workout_plans:
            w_assign = db.query(CustomerWorkoutAssignment).filter(CustomerWorkoutAssignment.user_id == rahul.id).first()
            if not w_assign:
                w_assign = CustomerWorkoutAssignment(
                    user_id=rahul.id,
                    plan_id=created_workout_plans[0].id,
                    notes="Assigned by Head Coach for mass building",
                    is_active=True,
                )
                db.add(w_assign)
                db.commit()

        # 10. Seed Announcements
        global_notif = db.query(Notification).filter(Notification.user_id == None).first()
        if not global_notif:
            notif1 = Notification(
                user_id=None,
                title="THE GYM – New High-Grade Barbells & Dumbbells Added!",
                message="We have upgraded our free-weights area with new Olympic rubber bumper plates and competition barbells. Keep crushing your goals!",
                type="ANNOUNCEMENT",
            )
            notif2 = Notification(
                user_id=None,
                title="Hydration & Locker Etiquette Reminder",
                message="Members are kindly requested to re-rack weights after their sets and keep personal belongings locked in designated lockers.",
                type="ANNOUNCEMENT",
            )
            db.add_all([notif1, notif2])
            db.commit()

        print("Database successfully seeded with realistic sample data!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
