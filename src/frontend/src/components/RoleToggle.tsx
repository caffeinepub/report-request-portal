import { useRole } from '../contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Shield, ArrowLeftRight } from 'lucide-react';

export default function RoleToggle() {
  const { role, toggleRole } = useRole();

  return (
    <div className="flex items-center gap-3">
      <Badge 
        variant={role === 'Admin' ? 'default' : 'secondary'} 
        className="px-4 py-2 text-sm font-medium shadow-sm"
      >
        {role === 'Admin' ? (
          <Shield className="w-4 h-4 mr-2" strokeWidth={2.5} />
        ) : (
          <UserCircle className="w-4 h-4 mr-2" strokeWidth={2.5} />
        )}
        {role}
      </Badge>
      <Button 
        onClick={toggleRole} 
        variant="outline" 
        size="sm"
        className="shadow-sm hover:shadow-md transition-all hover:border-primary/50"
      >
        <ArrowLeftRight className="w-4 h-4 mr-2" />
        Switch to {role === 'Admin' ? 'Requester' : 'Admin'}
      </Button>
    </div>
  );
}
