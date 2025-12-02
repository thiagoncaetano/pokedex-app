import { PageHeader } from '@/shared/ui/PageHeader';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { SignUpForm } from '@/features/users';

export default function SignUpPage() {
  return (
    <PageHeader
      title={createPageTitle('Sign Up')}
      description={pageDescriptions.login}
    >
      <SignUpForm />
    </PageHeader>
  );
}
