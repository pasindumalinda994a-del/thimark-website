/* eslint-disable @next/next/no-img-element */
export function Logo() {
  return (
    <span className="tm-logo">
      <img src="/brand/logo-mark.svg" alt="" className="tm-logo__mark" width={32} height={42} />
      <span className="tm-logo__text">
        <span className="tm-logo__name">THIMARK</span>
        <span className="tm-logo__tag">Content studio</span>
      </span>
    </span>
  );
}
