import { create } from 'zustand';

const useProfileImageStore = create((set)=> ({
    imageVersion: 0,
    incrementImageVersion: ()=>
        set((state) => ({ imageVersion: state.imageVersion + 1})), 
}))

export default useProfileImageStore;