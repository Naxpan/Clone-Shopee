interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="rs-stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={[
            "rs-stepper__item",
            index === currentStep ? "rs-stepper__item--active" : "",
            index < currentStep ? "rs-stepper__item--done" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="rs-stepper__top">
            <div
              className={`rs-stepper__line rs-stepper__line--left${index === 0 ? " rs-stepper__line--hidden" : ""}`}
            />
            <div className="rs-stepper__circle">
              {index < currentStep ? (
                <i className="fa-solid fa-check" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div
              className={`rs-stepper__line rs-stepper__line--right${index === steps.length - 1 ? " rs-stepper__line--hidden" : ""}`}
            />
          </div>
          <span className="rs-stepper__label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
