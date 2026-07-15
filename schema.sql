-- SQL Schema for Black Cypher cybersecurity platform

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY, -- Firebase UID or custom credentials UID
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(128) UNIQUE,
    password_hash TEXT,
    phone VARCHAR(50) UNIQUE,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'admin'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'blocked'
    avatar TEXT,
    qualification VARCHAR(255),
    age INTEGER,
    gender VARCHAR(50),
    current_course VARCHAR(255),
    referral_source VARCHAR(255),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    dob VARCHAR(255),
    discriminator VARCHAR(10)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro'
    meet_plan_expiry TIMESTAMP WITH TIME ZONE, -- Expiry of Sat/Sun doubt clearing option
    active_training_plan VARCHAR(50) DEFAULT 'none', -- 'none', '1_week', '1_month', '2_month', '3_month'
    training_plan_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    level VARCHAR(50) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    xp_reward INTEGER DEFAULT 100,
    thumbnail TEXT,
    duration VARCHAR(50),
    is_free BOOLEAN DEFAULT false
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL, -- Secured video source
    duration VARCHAR(50),
    order_no INTEGER DEFAULT 1,
    is_free BOOLEAN DEFAULT false
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    pdf_url TEXT NOT NULL, -- Protected PDF link
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table (School / College sessions or Individual training)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    booking_type VARCHAR(50) NOT NULL, -- 'session_school', 'training_individual'
    institute_name VARCHAR(255), -- For schools / colleges
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    plan_duration VARCHAR(50), -- '1_week', '1_month', '2_month', '3_month'
    amount_paid NUMERIC(10,2) DEFAULT 0.00,
    receipt_url TEXT, -- Link to generated receipt
    booking_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table (assigned by admin)
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE, -- User ID
    xp_reward INTEGER DEFAULT 500,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create task submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    submission_content TEXT NOT NULL, -- Link or text note
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'approved', 'rejected'
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Saturday/Sunday meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    meet_url TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN DEFAULT true
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create partners table (certificate partners, display partners)
CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    link TEXT,
    type VARCHAR(100) DEFAULT 'partner' -- 'partner', 'certificate_provider'
);

-- Create forum_posts table (Community Forum)
CREATE TABLE IF NOT EXISTS forum_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General', -- 'General', 'Web Exploits', 'Lab Help', etc.
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) DEFAULT 'Anonymous',
    author_avatar TEXT,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create forum_comments table (Forum Comments)
CREATE TABLE IF NOT EXISTS forum_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) DEFAULT 'Anonymous',
    author_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create certificates table (Verifiable Public Credentials)
CREATE TABLE IF NOT EXISTS certificates (
    hash_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE
);

-- Create feedbacks table (User platform feedback / testimonials)
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT,
    is_published BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'update', -- 'course', 'update', 'alert'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE, -- NULL means global
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_notification_states table
CREATE TABLE IF NOT EXISTS user_notification_states (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_id)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table for user to user chat
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



