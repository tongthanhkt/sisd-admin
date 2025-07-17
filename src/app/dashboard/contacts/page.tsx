import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import ContactListing from '@/features/contacts/components/contact-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Contacts'
};

type pageProps = {
  searchParams: Promise<any>;
};

export default async function ContactPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Contacts'
            description='Danh sách liên hệ gửi từ website.'
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={0} />
          }
        >
          <ContactListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
