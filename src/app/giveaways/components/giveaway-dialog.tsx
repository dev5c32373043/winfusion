'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAlert } from '@/app/components';

import { useAtom, useSetAtom } from 'jotai';
import { giveawaysAtom, giveawayFormDataAtom } from '../../state';

import { request, to, isMongoId } from '@/app/utils';

export type InputData = {
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in progress' | 'completed';
};

const createGiveaway = async data => {
  const resp = await request.post('/api/giveaways', data);
  return resp.data;
};

const updateGiveaway = async data => {
  const resp = await request.put(`/api/giveaways/${data._id}`, data);
  return resp.data;
};

export function GiveawayDialog() {
  const [isEditMode, setEditMode] = useState(false);
  const setGiveaways = useSetAtom(giveawaysAtom);

  const minDate = new Date().toISOString().slice(0, 16);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reqState, setReqState] = useState({ status: 'idle' });

  const showAlert = useAlert();
  const formInitialState = { title: '', description: '', dueDate: '', status: 'in progress' };
  const { reset, register, handleSubmit } = useForm<InputData>(formInitialState);

  const onSubmit: SubmitHandler<InputData> = async data => {
    if (reqState.status !== 'idle') return;
    setReqState({ status: 'pending' });

    const apiCall = isEditMode ? updateGiveaway : createGiveaway;
    const [err, giveaway] = await to(apiCall(data));
    if (err) {
      setReqState({ status: 'idle' });
      showAlert('Something is not right, please try again later');
      return;
    }

    if (isEditMode) {
      setGiveaways(g => g.map(item => (item._id === giveaway._id ? giveaway : item)));
    } else {
      setGiveaways(g => [giveaway, ...g]);
    }

    reset(formInitialState);

    dialogRef.current.close();
    setReqState({ status: 'idle' });
    setEditMode(false);
  };

  const [giveawayFormData, setFormData] = useAtom(giveawayFormDataAtom);

  useEffect(() => {
    if (!isMongoId(giveawayFormData?._id)) return;

    reset(giveawayFormData);

    setEditMode(true);

    dialogRef.current.showModal();
  }, [giveawayFormData]);

  const closeDialog = () => {
    reset(formInitialState);

    setFormData(null);
    setEditMode(false);
    dialogRef.current.close();
  };

  const isCompleted = giveawayFormData?.status === 'completed';

  return (
    <>
      <button className="btn btn-primary text-white" onClick={() => dialogRef.current.showModal()}>
        <span>New Giveaway</span>
      </button>

      <dialog className="modal modal-bottom sm:modal-middle" ref={dialogRef}>
        <form method="dialog" className="modal-box" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">{isEditMode ? 'Edit' : 'Create'} Giveaway</h3>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Type title"
              className="input input-bordered w-full"
              {...register('title', { required: true, minLength: 3 })}
            />
          </div>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              {...register('description', { required: true })}
            ></textarea>
          </div>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Due Date</span>
            </label>
            <input
              name="dueDate"
              type="datetime-local"
              placeholder="Chose due date"
              className="input input-bordered w-full"
              min={minDate}
              disabled={isCompleted}
              {...register('dueDate', { required: true })}
            />
          </div>

          <div className="py-4">
            <label className="label">
              <span className="label-text">Status</span>
            </label>

            <select className="select select-bordered" {...register('status')} disabled={isCompleted}>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
              {isEditMode && <option value="completed">Completed</option>}
            </select>
          </div>

          <div className="modal-action justify-between">
            <button type="button" className="btn" onClick={closeDialog}>
              Close
            </button>
            <button type="submit" className="btn">
              {reqState.status !== 'idle' && <span className="loading loading-spinner"></span>}
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
