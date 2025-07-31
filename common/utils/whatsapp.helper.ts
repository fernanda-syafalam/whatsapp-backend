import { GroupMetadata } from '@whiskeysockets/baileys';
import { Group } from 'src/whatsapp/dto/whatsapp';

interface WhatsAppGroups {
  [groupId: string]: GroupMetadata;
}

const helper = {
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  formatGroups(groups?: WhatsAppGroups): Group[] {
    if (!groups) return [];

    return Object.entries(groups).map(([id, group]) => ({
      id,
      subject: group.subject,
      subjectTime: group.subjectTime || 0,
      size: group.size || 0,
      subjectOwner: group.subjectOwner || '',
    }));
  },
};

export default helper;
