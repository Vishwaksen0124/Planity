import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux"
import { getInitials } from "../utils";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { useDeleteUserMutation, useGetTeamListQuery, useUserActionMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const roles = user.role
  if (roles !== "Admin") {
      toast.error("Not authenticated");
      console.log("Not authenticated");
      return <Navigate to='/tasks' />;
    }

  const { data, isLoading, refetch } = useGetTeamListQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async (data) => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(result.data.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);

    } catch (error) {
      console.log(error);
      toast.error(err?.data?.message);

    }

  };


  const deleteHandler = async () => {
    try {
      const result = await deleteUser(selected)
      refetch();
      toast.success(result?.message || "User deleted successfully!");
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.error("Error during deletion:", error);
      const errorMessage = error?.data?.message || error.message || "Failed to delete user.";
      toast.error(errorMessage);
    }
  };



  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };
  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  }


  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    if (user?.role === "Admin") return null;
    return(
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className='p-2'>{user.title}</td>
      <td className='p-2'>{user.email || "user.email.com"}</td>
      <td className='p-2'>{user.role}</td>

      {/* <td>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td> */}
      {roles === "Admin" && (
        <td className='p-2 flex gap-4 justify-end'>
          <Button
            className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
            label='Edit'
            type='button'
            onClick={() => editClick(user)}
          />

          <Button
            className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
            label='Delete'
            type='button'
            onClick={() => deleteClick(user?._id)}
          />
        </td>
      )}
    </tr>
    )
    
  };

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='  Team Members' />
          {roles === "Admin" && (
            <Button
              label='Add New User'
              icon={<IoMdAdd className='text-lg' />}
              className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
              onClick={() => setOpen(true)}
            />
          )}

        </div>
          <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
            <div className='overflow-x-auto'>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {data?.map((user, index) => (
                    <TableRow key={index} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;