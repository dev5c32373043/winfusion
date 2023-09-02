'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAlert } from '@/app/components';

import { useAtom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';

import { request, to, isMongoId } from '@/app/utils';

export interface ParticipantDialogProps {
  giveawayId: string;
  updateParticipantsCount: (val: number) => void;
  status: string;
}

export type InputData = {
  name: string;
  email: string;
  extraInfo: string;
};

export function ParticipantDialog({ giveawayId, status, updateParticipantsCount }: ParticipantDialogProps) {
  const userAtom = useMemo(() => atomWithStorage(`joined-${giveawayId}`, null), [giveawayId]);
  const [joinedUserId, setUserId] = useAtom(userAtom);

  const [reqState, setReqState] = useState({ status: 'idle' });
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showAlert = useAlert();

  const formInitialState = { name: '', email: '', extraInfo: '' };
  const { reset, register, handleSubmit } = useForm<InputData>(formInitialState);

  const onSubmit: SubmitHandler<InputData> = async data => {
    if (reqState.status !== 'idle' || isMongoId(joinedUserId)) return;
    setReqState({ status: 'pending' });

    const [err, resp] = await to(request.post(`/api/giveaways/${giveawayId}/participants`, data));
    if (err) {
      setReqState({ status: 'idle' });
      showAlert('Something is not right, please try again later');
      return;
    }

    setUserId(resp.data._id);

    updateParticipantsCount(1);

    reset(formInitialState);

    setReqState({ status: 'idle' });

    dialogRef.current.close();
  };

  const removeFromGiveaway = async () => {
    if (reqState.status !== 'idle' || !isMongoId(joinedUserId)) return;
    const [err, resp] = await to(request.delete(`/api/giveaways/${giveawayId}/participants/${joinedUserId}`));
    if (err) {
      setReqState({ status: 'idle' });
      showAlert('Something is not right, please try again later');
      return;
    }

    setUserId(RESET);
  };

  const closeDialog = () => {
    dialogRef.current.close();
    reset(formInitialState);
  };

  return (
    <>
      <button
        className="btn btn-active btn-primary text-white"
        disabled={status !== 'in progress'}
        onClick={() => (joinedUserId ? removeFromGiveaway() : dialogRef.current.showModal())}
      >
        {joinedUserId ? 'Withdraw from giveaway' : 'Participate'}
      </button>

      <dialog className="modal modal-bottom sm:modal-middle" ref={dialogRef}>
        <form method="dialog" className="modal-box" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Participation form</h3>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Type your name"
              className="input input-bordered w-full"
              {...register('name', { required: true })}
            />
          </div>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Type your email"
              className="input input-bordered w-full"
              {...register('email', { required: true, pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ })}
            />
          </div>
          <div className="py-4">
            <label className="label">
              <span className="label-text">Extra Info</span>
            </label>
            <textarea
              name="extraInfo"
              className="textarea textarea-bordered w-full"
              placeholder="Additional information to identify you"
              {...register('extraInfo')}
            ></textarea>
          </div>

          <div className="modal-action justify-between">
            <button type="button" className="btn" onClick={closeDialog}>
              Close
            </button>
            <button type="submit" className="btn">
              {reqState.status !== 'idle' && <span className="loading loading-spinner"></span>}
              Submit
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
