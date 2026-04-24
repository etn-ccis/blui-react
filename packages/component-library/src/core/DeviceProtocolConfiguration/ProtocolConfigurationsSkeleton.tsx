import { Box, Paper, Skeleton } from '@mui/material';

const SkeletonListItem = (): JSX.Element => (
    <>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Skeleton variant="text" width="30%" height={24} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="50%" height={20} />
            </Box>
            <Skeleton variant="rounded" width={280} height={40} />
        </Box>
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
    </>
);

const SkeletonSection = ({ itemCount = 4 }: { itemCount?: number }): JSX.Element => (
    <Paper sx={{ mt: 2 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="text" width="25%" height={28} />
        </Box>
        {[...Array(itemCount)].map((_, i) => (
            <SkeletonListItem key={i} />
        ))}
    </Paper>
);

const SkeletonArrayItem = (): JSX.Element => (
    <Box
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}
    >
        <Skeleton variant="text" width={40} height={24} />
        <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
            {[...Array(4)].map((_, j) => (
                <Box key={j}>
                    <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                </Box>
            ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
        </Box>
    </Box>
);

const SkeletonArraySection = ({ itemCount = 2 }: { itemCount?: number }): JSX.Element => (
    <Paper sx={{ mt: 2 }}>
        <Box
            sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Skeleton variant="text" width="25%" height={28} />
            <Skeleton variant="rounded" width={120} height={36} />
        </Box>
        {[...Array(itemCount)].map((_, i) => (
            <SkeletonArrayItem key={i} />
        ))}
    </Paper>
);

export const ProtocolConfigurationsSkeleton = (): JSX.Element => (
    <Box>
        {/* Protocol header */}
        <Paper>
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Skeleton variant="text" width="15%" height={24} />
                    <Skeleton variant="text" width="30%" height={24} />
                </Box>
            </Box>
        </Paper>

        {/* Field sections */}
        <SkeletonSection itemCount={5} />
        <SkeletonSection itemCount={3} />
        <SkeletonSection itemCount={4} />

        {/* Array sections */}
        <SkeletonArraySection itemCount={3} />
        <SkeletonArraySection itemCount={2} />
    </Box>
);
