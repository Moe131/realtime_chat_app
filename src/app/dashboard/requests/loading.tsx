import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading(){
    return (
        <div className='max-w-lg mx-auto py-8 px-8'>
            <Skeleton className='mb-4' height={60} width={500} />
            <Skeleton height={50} width={350} />
            <Skeleton height={50} width={350} />
            <Skeleton height={50} width={350} />

        </div>

    )
}