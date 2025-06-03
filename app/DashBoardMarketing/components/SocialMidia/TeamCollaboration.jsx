// src/components/TeamCollaboration.jsx
"use client";
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  TextField
} from '@mui/material';
import { Edit, Delete, Add, Check, Close } from '@mui/icons-material';
import { useState } from 'react';

const TeamCollaboration = ({ team, onUpdate }) => {
  const [editMode, setEditMode] = useState(null);
  const [newMember, setNewMember] = useState('');
  const [members, setMembers] = useState(team || []);

  // بيانات افتراضية إذا لم توجد بيانات
  const defaultMembers = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مدير الحملات',
      avatar: '/team/ahmed.jpg',
      lastActive: '2025-04-20T08:30:00',
      permissions: ['تعديل', 'نشر']
    }
  ];

  const handleAddMember = () => {
    if (newMember.trim()) {
      const newMemberObj = {
        id: members.length + 1,
        name: newMember,
        role: 'عضو جديد',
        avatar: '',
        lastActive: new Date().toISOString(),
        permissions: ['مشاهدة']
      };
      setMembers([...members, newMemberObj]);
      setNewMember('');
      onUpdate?.([...members, newMemberObj]);
    }
  };

  const handleDelete = (id) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    onUpdate?.(updated);
  };

  return (
    <Box sx={{ 
      p: 3, 
      border: '1px solid #ddd', 
      borderRadius: 4,
      background: 'white'
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        إدارة فريق العمل
      </Typography>

      {/* إضافة عضو جديد */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="إضافة عضو جديد"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
        />
        <IconButton 
          color="primary"
          onClick={handleAddMember}
          sx={{ border: '1px solid' }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* جدول الأعضاء */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العضو</TableCell>
              <TableCell>الصلاحيات</TableCell>
              <TableCell>آخر نشاط</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(members.length > 0 ? members : defaultMembers).map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={member.avatar} />
                    <div>
                      <Typography>{member.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.role}
                      </Typography>
                    </div>
                  </Box>
                </TableCell>
                
                <TableCell>
                  {member.permissions.map((p, i) => (
                    <Chip key={i} label={p} sx={{ m: 0.5 }} />
                  ))}
                </TableCell>
                
                <TableCell>
                  {new Date(member.lastActive).toLocaleDateString('ar-EG')}
                </TableCell>
                
                <TableCell>
                  <IconButton onClick={() => setEditMode(member.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(member.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamCollaboration;