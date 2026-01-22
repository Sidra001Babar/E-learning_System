<div className="flex min-h-screen text-white"
      style={{background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'}}>
      <div className="hidden md:flex md:w-1/2 items-center justify-center float-animation">
        <img
          src={RegistrationPageSideImg}
          alt="Registration Illustration"
          className="max-w-md rounded-full shadow-2xl"
        />
      </div>
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (strength === 5) {
              handleSubmit(e);
            }
          }}
          className="w-full max-w-md rounded-2xl  p-8 space-y-6"
        >
          
        </form>
      </div>
    </div>