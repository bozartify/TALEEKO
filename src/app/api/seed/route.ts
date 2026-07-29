import { NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function POST() {
  try {
    const teacher = await prisma.user.upsert({
      where: { id: DEMO_TEACHER_ID },
      update: {},
      create: {
        id: DEMO_TEACHER_ID,
        email: 'demo@teachweaver.ai',
        name: 'Alex Johnson',
        role: 'teacher',
      },
    })

    const course = await prisma.course.upsert({
      where: { id: 'demo_course_001' },
      update: {},
      create: {
        id: 'demo_course_001',
        title: '7th Grade Biology',
        description: 'Life science, cells, ecosystems, and genetics',
        subject: 'Science',
        grade: '7th',
        color: '#8b5cf6',
        teacherId: DEMO_TEACHER_ID,
      },
    })

    const lessons = await Promise.all([
      prisma.lesson.upsert({
        where: { id: 'demo_lesson_001' },
        update: {},
        create: {
          id: 'demo_lesson_001',
          title: 'Introduction to Cells',
          objective: 'Students will understand the basic structure of cells',
          duration: 45,
          status: 'published',
          courseId: 'demo_course_001',
        },
      }),
      prisma.lesson.upsert({
        where: { id: 'demo_lesson_002' },
        update: {},
        create: {
          id: 'demo_lesson_002',
          title: 'Photosynthesis',
          objective: 'Students will explain the process of photosynthesis',
          duration: 60,
          status: 'published',
          courseId: 'demo_course_001',
        },
      }),
    ])

    const classrooms = await Promise.all([
      prisma.classroom.upsert({
        where: { id: 'demo_class_001' },
        update: {},
        create: {
          id: 'demo_class_001',
          name: 'AP Biology',
          subject: 'Biology',
          grade: '11th',
          period: '1st Period',
          color: '#8b5cf6',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.classroom.upsert({
        where: { id: 'demo_class_002' },
        update: {},
        create: {
          id: 'demo_class_002',
          name: '10th English',
          subject: 'English',
          grade: '10th',
          period: '3rd Period',
          color: '#f43f5e',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.classroom.upsert({
        where: { id: 'demo_class_003' },
        update: {},
        create: {
          id: 'demo_class_003',
          name: 'Algebra II',
          subject: 'Mathematics',
          grade: '10th',
          period: '5th Period',
          color: '#14b8a6',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
    ])

    const students = await Promise.all([
      prisma.student.upsert({
        where: { id: 'demo_stu_001' },
        update: {},
        create: {
          id: 'demo_stu_001',
          name: 'Emma Rodriguez',
          email: 'emma.rodriguez@school.edu',
          grade: '11th',
          classId: 'demo_class_001',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_002' },
        update: {},
        create: {
          id: 'demo_stu_002',
          name: 'James Kim',
          email: 'james.kim@school.edu',
          grade: '11th',
          classId: 'demo_class_001',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_003' },
        update: {},
        create: {
          id: 'demo_stu_003',
          name: 'Aisha Thompson',
          email: 'aisha.thompson@school.edu',
          grade: '11th',
          classId: 'demo_class_001',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_004' },
        update: {},
        create: {
          id: 'demo_stu_004',
          name: 'Liam Chen',
          email: 'liam.chen@school.edu',
          grade: '10th',
          classId: 'demo_class_002',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_005' },
        update: {},
        create: {
          id: 'demo_stu_005',
          name: 'Sofia Patel',
          email: 'sofia.patel@school.edu',
          grade: '10th',
          classId: 'demo_class_002',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_006' },
        update: {},
        create: {
          id: 'demo_stu_006',
          name: 'Noah Williams',
          email: 'noah.williams@school.edu',
          grade: '10th',
          classId: 'demo_class_002',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_007' },
        update: {},
        create: {
          id: 'demo_stu_007',
          name: 'Olivia Martinez',
          email: 'olivia.martinez@school.edu',
          grade: '10th',
          classId: 'demo_class_003',
        },
      }),
      prisma.student.upsert({
        where: { id: 'demo_stu_008' },
        update: {},
        create: {
          id: 'demo_stu_008',
          name: 'Ethan Johnson',
          email: 'ethan.johnson@school.edu',
          grade: '10th',
          classId: 'demo_class_003',
        },
      }),
    ])

    const rubrics = await Promise.all([
      prisma.rubric.upsert({
        where: { id: 'demo_rubric_001' },
        update: {},
        create: {
          id: 'demo_rubric_001',
          title: 'Lab Report Assessment',
          subject: 'Biology',
          grade: '11th',
          criteria: JSON.stringify([
            { name: 'Hypothesis', description: 'Clear and testable hypothesis' },
            { name: 'Procedure', description: 'Detailed and reproducible steps' },
            { name: 'Data Analysis', description: 'Accurate graphs and interpretation' },
            { name: 'Conclusion', description: 'Evidence-based conclusion' },
          ]),
          levels: 4,
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.rubric.upsert({
        where: { id: 'demo_rubric_002' },
        update: {},
        create: {
          id: 'demo_rubric_002',
          title: 'Persuasive Essay Rubric',
          subject: 'English',
          grade: '10th',
          criteria: JSON.stringify([
            { name: 'Thesis', description: 'Strong and arguable thesis statement' },
            { name: 'Evidence', description: 'Relevant and well-cited supporting evidence' },
            { name: 'Organization', description: 'Logical flow and paragraph structure' },
            { name: 'Mechanics', description: 'Grammar, spelling, and punctuation' },
          ]),
          levels: 4,
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.rubric.upsert({
        where: { id: 'demo_rubric_003' },
        update: {},
        create: {
          id: 'demo_rubric_003',
          title: 'Problem Set Grading',
          subject: 'Mathematics',
          grade: '10th',
          criteria: JSON.stringify([
            { name: 'Correctness', description: 'Accurate final answers' },
            { name: 'Work Shown', description: 'Complete and clear solution steps' },
            { name: 'Notation', description: 'Proper mathematical notation' },
          ]),
          levels: 4,
          teacherId: DEMO_TEACHER_ID,
        },
      }),
    ])

    const calendarEvents = await Promise.all([
      prisma.calendarEvent.upsert({
        where: { id: 'demo_event_001' },
        update: {},
        create: {
          id: 'demo_event_001',
          title: 'AP Biology - Cell Division Lab',
          description: 'Hands-on microscope lab examining stages of mitosis',
          date: new Date('2026-08-04T09:00:00Z'),
          endDate: new Date('2026-08-04T10:30:00Z'),
          type: 'class',
          color: '#8b5cf6',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.calendarEvent.upsert({
        where: { id: 'demo_event_002' },
        update: {},
        create: {
          id: 'demo_event_002',
          title: 'Department Meeting',
          description: 'Monthly science department curriculum review',
          date: new Date('2026-08-05T14:00:00Z'),
          endDate: new Date('2026-08-05T15:00:00Z'),
          type: 'meeting',
          color: '#f97316',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.calendarEvent.upsert({
        where: { id: 'demo_event_003' },
        update: {},
        create: {
          id: 'demo_event_003',
          title: 'Essay Submissions Due',
          description: 'Final deadline for persuasive essay assignment',
          date: new Date('2026-08-06T23:59:00Z'),
          type: 'deadline',
          color: '#f43f5e',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.calendarEvent.upsert({
        where: { id: 'demo_event_004' },
        update: {},
        create: {
          id: 'demo_event_004',
          title: 'Science Fair',
          description: 'Annual school science fair in the gymnasium',
          date: new Date('2026-08-12T10:00:00Z'),
          endDate: new Date('2026-08-12T15:00:00Z'),
          type: 'event',
          color: '#14b8a6',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
      prisma.calendarEvent.upsert({
        where: { id: 'demo_event_005' },
        update: {},
        create: {
          id: 'demo_event_005',
          title: 'Algebra II - Chapter 7 Quiz',
          description: 'Quiz covering polynomial functions and factoring',
          date: new Date('2026-08-07T13:00:00Z'),
          endDate: new Date('2026-08-07T13:45:00Z'),
          type: 'class',
          color: '#14b8a6',
          teacherId: DEMO_TEACHER_ID,
        },
      }),
    ])

    const notifications = await Promise.all([
      prisma.notification.upsert({
        where: { id: 'demo_notif_001' },
        update: {},
        create: {
          id: 'demo_notif_001',
          userId: DEMO_TEACHER_ID,
          title: 'Assignment Submitted',
          message: 'Emma Rodriguez submitted her Photosynthesis Lab Report',
          type: 'info',
          read: false,
        },
      }),
      prisma.notification.upsert({
        where: { id: 'demo_notif_002' },
        update: {},
        create: {
          id: 'demo_notif_002',
          userId: DEMO_TEACHER_ID,
          title: 'Low Score Alert',
          message: 'Noah Williams scored below 70% on the Genetics Quiz',
          type: 'warning',
          read: false,
        },
      }),
      prisma.notification.upsert({
        where: { id: 'demo_notif_003' },
        update: {},
        create: {
          id: 'demo_notif_003',
          userId: DEMO_TEACHER_ID,
          title: 'Meeting Reminder',
          message: 'Department meeting tomorrow at 2:00 PM',
          type: 'info',
          read: true,
        },
      }),
      prisma.notification.upsert({
        where: { id: 'demo_notif_004' },
        update: {},
        create: {
          id: 'demo_notif_004',
          userId: DEMO_TEACHER_ID,
          title: 'New Student Enrolled',
          message: 'Ethan Johnson has been added to Algebra II',
          type: 'success',
          read: true,
        },
      }),
      prisma.notification.upsert({
        where: { id: 'demo_notif_005' },
        update: {},
        create: {
          id: 'demo_notif_005',
          userId: DEMO_TEACHER_ID,
          title: 'Deadline Approaching',
          message: 'Essay submissions due in 3 days - 4 students have not submitted',
          type: 'warning',
          read: false,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      teacher,
      course,
      lessons,
      classrooms,
      students,
      rubrics,
      calendarEvents,
      notifications,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Seed failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
