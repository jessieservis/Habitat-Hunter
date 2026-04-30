# Habitat-Hunter
A FastAPI project: Guess the location of endangered species.

# Set up
1. Create a .venv (See Source 1)
2. Install requirements.txt ``pip install -r requirements.txt``
3. Open two terminals. 
4. In one, open the frontend folder using ``cd frontend``
5. In the other, open the backend folder using ``cd backend``
6. In the backend terminal, run ``uvicorn app.main:app --reload``
7. In the frontend terminal, run ``npm run dev`` and open the link provided

# Environment
Set the JWT secret used to sign access tokens. In development you can set a temporary value, but
do NOT use the default value in production.

Linux / macOS:
```
export JWT_SECRET_KEY='a-very-secret-key'
```

Windows (Powershell):
```
$env:JWT_SECRET_KEY = 'a-very-secret-key'
```

The application will warn at startup if `JWT_SECRET_KEY` is not set.

# Sources
1. https://fastapi.tiangolo.com/virtual-environments/#create-a-virtual-environment
2. Figma Make for frontend dev
   1. includes components from [shadcn/ui](https://ui.shadcn.com/) used under [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).
   2. includes photos from [Unsplash](https://unsplash.com) used under [license](https://unsplash.com/license).


# Credits
Created by Jessie Servis for CPS420 with Dr. Patrick Seeling
