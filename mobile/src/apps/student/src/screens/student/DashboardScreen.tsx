import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Button, Badge, Avatar, ProgressBar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const { width } = Dimensions.get('window');

interface DashboardData {
  student: {
    id: string;
    name: string;
    grade: string;
    class: string;
    profilePicture: string;
    attendanceRate: number;
  };
  assignments: {
    pending: number;
    submitted: number;
    overdue: number;
    upcoming: Array<{
      id: string;
      title: string;
      subject: string;
      dueDate: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  quizzes: {
    available: number;
    completed: number;
    upcoming: Array<{
      id: string;
      title: string;
      subject: string;
      date: string;
      duration: string;
    }>;
  };
  results: {
    latest: Array<{
      subject: string;
      grade: string;
      marks: number;
      date: string;
    }>;
    average: number;
  };
  fees: {
    totalFees: number;
    paidAmount: number;
    outstandingAmount: number;
    nextPaymentDue: string;
  };
  polls: {
    active: number;
    participated: number;
  };
  timetable: {
    todayClasses: Array<{
      subject: string;
      time: string;
      room: string;
      teacher: string;
    }>;
  };
  notifications: {
    unread: number;
    recent: Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      type: 'assignment' | 'quiz' | 'result' | 'fee' | 'general';
    }>;
  };
}

const StudentDashboardScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isOnline, addOfflineData } = useOffline();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isOnline) {
        // Fetch from API
        const response = await fetch('/api/mobile/student/dashboard', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          
          // Cache data offline
          await addOfflineData('dashboard', data);
        }
      } else {
        // Load from offline cache
        const offlineData = await getOfflineDashboardData();
        if (offlineData) {
          setDashboardData(offlineData);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Try to load from cache as fallback
      const offlineData = await getOfflineDashboardData();
      if (offlineData) {
        setDashboardData(offlineData);
      }
    } finally {
      setLoading(false);
    }
  };

  const getOfflineDashboardData = async (): Promise<DashboardData | null> => {
    // Implement offline data retrieval
    return null;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const handleAssignmentPress = () => {
    // Navigate to assignments
  };

  const handleQuizPress = () => {
    // Navigate to quizzes
  };

  const handleResultsPress = () => {
    // Navigate to results
  };

  const handleFeesPress = () => {
    // Navigate to fees
  };

  const handlePollsPress = () => {
    // Navigate to polls
  };

  const handleTimetablePress = () => {
    // Navigate to timetable
  };

  const renderQuickStats = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.quickStatsContainer}>
        <View style={styles.statCard}>
          <Icon name="assignment" size={24} color="#FF6B6B" />
          <Text style={styles.statNumber}>{dashboardData.assignments.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="quiz" size={24} color="#4ECDC4" />
          <Text style={styles.statNumber}>{dashboardData.quizzes.available}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="school" size={24} color="#45B7D1" />
          <Text style={styles.statNumber}>{dashboardData.results.average.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Grade</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="account-balance-wallet" size={24} color="#96CEB4" />
          <Text style={styles.statNumber}>${dashboardData.fees.outstandingAmount}</Text>
          <Text style={styles.statLabel}>Fees Due</Text>
        </View>
      </View>
    );
  };

  const renderUpcomingAssignments = () => {
    if (!dashboardData || dashboardData.assignments.upcoming.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming Assignments</Text>
            <TouchableOpacity onPress={handleAssignmentPress}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.assignments.upcoming.slice(0, 3).map((assignment) => (
            <View key={assignment.id} style={styles.assignmentItem}>
              <View style={styles.assignmentLeft}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                <Text style={styles.assignmentDue}>Due: {assignment.dueDate}</Text>
              </View>
              <Chip
                style={[
                  styles.priorityChip,
                  assignment.priority === 'high' && styles.highPriority,
                  assignment.priority === 'medium' && styles.mediumPriority,
                  assignment.priority === 'low' && styles.lowPriority,
                ]}
              >
                {assignment.priority.toUpperCase()}
              </Chip>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderUpcomingQuizzes = () => {
    if (!dashboardData || dashboardData.quizzes.upcoming.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming Quizzes</Text>
            <TouchableOpacity onPress={handleQuizPress}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.quizzes.upcoming.slice(0, 3).map((quiz) => (
            <View key={quiz.id} style={styles.quizItem}>
              <View style={styles.quizLeft}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizSubject}>{quiz.subject}</Text>
                <Text style={styles.quizDate}>{quiz.date} • {quiz.duration}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#666" />
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderLatestResults = () => {
    if (!dashboardData || dashboardData.results.latest.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Latest Results</Text>
            <TouchableOpacity onPress={handleResultsPress}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.results.latest.slice(0, 3).map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.resultLeft}>
                <Text style={styles.resultSubject}>{result.subject}</Text>
                <Text style={styles.resultDate}>{result.date}</Text>
              </View>
              <View style={styles.resultRight}>
                <Text style={styles.resultMarks}>{result.marks}%</Text>
                <Text style={styles.resultGrade}>{result.grade}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderTodayTimetable = () => {
    if (!dashboardData || dashboardData.timetable.todayClasses.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Classes</Text>
            <TouchableOpacity onPress={handleTimetablePress}>
              <Text style={styles.seeAll}>View Timetable</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.timetable.todayClasses.map((classItem, index) => (
            <View key={index} style={styles.classItem}>
              <View style={styles.classLeft}>
                <Text style={styles.classTime}>{classItem.time}</Text>
                <Text style={styles.classSubject}>{classItem.subject}</Text>
                <Text style={styles.classRoom}>Room: {classItem.room}</Text>
              </View>
              <Text style={styles.classTeacher}>{classItem.teacher}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderFeesStatus = () => {
    if (!dashboardData) return null;

    const progressPercentage = dashboardData.fees.totalFees > 0 
      ? (dashboardData.fees.paidAmount / dashboardData.fees.totalFees) * 100 
      : 0;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Fees Status</Text>
            <TouchableOpacity onPress={handleFeesPress}>
              <Text style={styles.seeAll}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.feesOverview}>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Total Fees:</Text>
              <Text style={styles.feesAmount}>${dashboardData.fees.totalFees}</Text>
            </View>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Paid:</Text>
              <Text style={styles.feesAmountPaid}>${dashboardData.fees.paidAmount}</Text>
            </View>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Outstanding:</Text>
              <Text style={styles.feesAmountOutstanding}>${dashboardData.fees.outstandingAmount}</Text>
            </View>
          </View>
          
          <ProgressBar
            progress={progressPercentage / 100}
            color={progressPercentage >= 80 ? '#4CAF50' : progressPercentage >= 50 ? '#FF9800' : '#F44336'}
            style={styles.feesProgressBar}
          />
          
          <Text style={styles.nextPaymentDue}>
            Next payment due: {dashboardData.fees.nextPaymentDue}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderActivePolls = () => {
    if (!dashboardData || dashboardData.polls.active === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Active Polls</Text>
            <TouchableOpacity onPress={handlePollsPress}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pollsOverview}>
            <Icon name="poll" size={32} color="#FF6B6B" />
            <View style={styles.pollsStats}>
              <Text style={styles.pollsActive}>{dashboardData.polls.active} Active</Text>
              <Text style={styles.pollsParticipated}>{dashboardData.polls.participated} Participated</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderNotifications = () => {
    if (!dashboardData || dashboardData.notifications.unread === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.notificationHeader}>
              <Text style={styles.cardTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <Badge style={styles.notificationBadge}>{unreadCount}</Badge>
              )}
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.notifications.recent.slice(0, 3).map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <Icon
                name={
                  notification.type === 'assignment' ? 'assignment' :
                  notification.type === 'quiz' ? 'quiz' :
                  notification.type === 'result' ? 'school' :
                  notification.type === 'fee' ? 'account-balance-wallet' : 'notifications'
                }
                size={20}
                color="#666"
              />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Student Header */}
      {dashboardData && (
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <Avatar.Image
                size={60}
                source={{ uri: dashboardData.student.profilePicture }}
              />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{dashboardData.student.name}</Text>
                <Text style={styles.studentGrade}>Grade {dashboardData.student.grade} • {dashboardData.student.class}</Text>
                <View style={styles.attendanceContainer}>
                  <Icon name="event-available" size={16} color="#4CAF50" />
                  <Text style={styles.attendanceText}>
                    {dashboardData.student.attendanceRate.toFixed(1)}% Attendance
                  </Text>
                </View>
              </View>
              {!isOnline && (
                <View style={styles.offlineBadge}>
                  <Icon name="wifi-off" size={16} color="#FF6B6B" />
                  <Text style={styles.offlineText}>Offline</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Stats */}
      {renderQuickStats()}

      {/* Upcoming Assignments */}
      {renderUpcomingAssignments()}

      {/* Upcoming Quizzes */}
      {renderUpcomingQuizzes()}

      {/* Latest Results */}
      {renderLatestResults()}

      {/* Today's Timetable */}
      {renderTodayTimetable()}

      {/* Fees Status */}
      {renderFeesStatus()}

      {/* Active Polls */}
      {renderActivePolls()}

      {/* Notifications */}
      {renderNotifications()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  attendanceText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 4,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: width * 0.2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 12,
    color: '#2E7D32',
  },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  assignmentLeft: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  assignmentSubject: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  assignmentDue: {
    fontSize: 11,
    color: '#FF6B6B',
    marginTop: 2,
  },
  priorityChip: {
    height: 24,
  },
  highPriority: {
    backgroundColor: '#FF6B6B20',
  },
  mediumPriority: {
    backgroundColor: '#FF980020',
  },
  lowPriority: {
    backgroundColor: '#4CAF5020',
  },
  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quizLeft: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  quizSubject: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quizDate: {
    fontSize: 11,
    color: '#4ECDC4',
    marginTop: 2,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLeft: {
    flex: 1,
  },
  resultSubject: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  resultDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  resultMarks: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#45B7D1',
  },
  resultGrade: {
    fontSize: 12,
    color: '#45B7D1',
    marginTop: 2,
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  classLeft: {
    flex: 1,
  },
  classTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  classSubject: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  classRoom: {
    fontSize: 11,
    color: '#96CEB4',
    marginTop: 2,
  },
  classTeacher: {
    fontSize: 12,
    color: '#666',
  },
  feesOverview: {
    marginBottom: 16,
  },
  feesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feesLabel: {
    fontSize: 14,
    color: '#666',
  },
  feesAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  feesAmountPaid: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  feesAmountOutstanding: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  feesProgressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 12,
  },
  nextPaymentDue: {
    fontSize: 12,
    color: '#FF9800',
    textAlign: 'center',
  },
  pollsOverview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollsStats: {
    marginLeft: 16,
  },
  pollsActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  pollsParticipated: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    marginLeft: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
});

export default StudentDashboardScreen;
