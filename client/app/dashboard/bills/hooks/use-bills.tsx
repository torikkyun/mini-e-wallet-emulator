import { useState, useEffect } from 'react';
import axios from 'axios';

interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'internet' | 'phone';
  company: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  description: string;
}

interface StatusCounts {
  all: number;
  pending: number;
  success: number;
  failed: number;
  cancelled: number;
}

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    all: 0,
    pending: 0,
    success: 0,
    failed: 0,
    cancelled: 0,
  });
  const [limit] = useState(9);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      if (selectedType !== 'all') params.append('billType', selectedType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bill-payments?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      const apiBills = res.data?.data?.data || [];
      const pagination = res.data?.data?.pagination || {};

      const mappedBills: Bill[] = apiBills.map((item: any) => ({
        id: item.id,
        type: item.billType,
        company: item.provider?.name || '',
        accountNumber: item.provider?.accountNumber || '',
        amount: item.amount,
        dueDate: item.createdAt,
        status: item.status,
        description: item.description || '',
      }));

      setBills(mappedBills);
      setTotalPages(pagination.totalPages || 1);
      setTotalItems(pagination.total || 0);
    } catch (err) {
      setBills([]);
      setTotalPages(1);
      setTotalItems(0);
    }
    setLoading(false);
  };

  const fetchStatusCounts = async () => {
    try {
      const statusList = ['all', 'pending', 'success', 'failed', 'cancelled'];
      const counts: StatusCounts = {
        all: 0,
        pending: 0,
        success: 0,
        failed: 0,
        cancelled: 0,
      };

      for (const status of statusList) {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '1');
        if (selectedType !== 'all') params.append('billType', selectedType);
        if (status !== 'all') params.append('status', status);

        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/bill-payments?${params.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          );
          const pagination = res.data?.data?.pagination || {};
          counts[status as keyof StatusCounts] = pagination.total || 0;
        } catch (err) {
          counts[status as keyof StatusCounts] = 0;
        }
      }

      setStatusCounts(counts);
    } catch (err) {
      setStatusCounts({
        all: 0,
        pending: 0,
        success: 0,
        failed: 0,
        cancelled: 0,
      });
    }
  };

  useEffect(() => {
    fetchBills();
  }, [currentPage, limit, selectedType, selectedStatus]);

  useEffect(() => {
    fetchStatusCounts();
  }, [selectedType]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedType, selectedStatus]);

  const filteredBills = bills.filter((bill) => {
    const matchesType = selectedType === 'all' || bill.type === selectedType;
    const matchesStatus =
      selectedStatus === 'all' || bill.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  return {
    bills: filteredBills,
    loading,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    statusCounts,
    setBills,
  };
};
