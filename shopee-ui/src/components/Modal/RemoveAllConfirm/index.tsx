import React from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

type RemoveAllConfirmProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  productCount?: number;
};

function RemoveAllConfirm({
  isOpen,
  onConfirm,
  onCancel,
  productCount,
}: RemoveAllConfirmProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-1">
      <div className="modal-1__overlay" onClick={onCancel}></div>
      <div className="modal-1__body">
        <div className="notify-confirm">
          <h3 className="notify-confirm-heading">{t("confirm-delete-all")}</h3>

          <div className="confirm-buttons">
            <button
              onClick={onConfirm}
              className="btn btn--primary btn-confirm"
            >
              {t("delete_all")}
            </button>
            <button onClick={onCancel} className="btn btn-cancel">
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default RemoveAllConfirm;
