import { auth, db, registerNewAsset } from './firebase.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// 1. AUTHENTICATION SHIELD
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-overlay').classList.add('hidden');
        loadRegistry();
    } else {
        document.getElementById('auth-overlay').classList.remove('hidden');
    }
});

document.getElementById('login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth);

// 2. REGISTER NEW ASSET
document.getElementById('submit-asset').onclick = async () => {
    const name = document.getElementById('asset-name').value;
    const platform = document.getElementById('asset-platform').value;
    const price = document.getElementById('asset-price').value;
    const unit = document.getElementById('asset-unit').value;

    if (!name || !price) return alert("Fields required.");

    const btn = document.getElementById('submit-asset');
    btn.innerText = "SPOOLING...";
    
    await registerNewAsset({ name, platform, price: parseFloat(price), unit });
    
    // Clear inputs
    document.getElementById('asset-name').value = '';
    document.getElementById('asset-price').value = '';
    btn.innerText = "Inject Asset";
};

// 3. LOAD & MONITOR REGISTRY
function loadRegistry() {
    const q = query(collection(db, "assets"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        const tbody = document.getElementById('asset-table-body');
        tbody.innerHTML = '';

        snapshot.docs.forEach(docSnap => {
            const asset = docSnap.data();
            const id = docSnap.id;

            const row = document.createElement('tr');
            row.className = "bg-white/[0.02] hover:bg-white/[0.04] transition-all";
            row.innerHTML = `
                <td class="p-6 rounded-l-2xl font-bold text-xs uppercase italic">${asset.name}</td>
                <td class="p-6 text-[10px] font-black uppercase text-gray-500">${asset.platform}</td>
                <td class="p-6 font-black text-primary">$${asset.price}</td>
                <td class="p-6">
                    <button onclick="toggleAsset('${id}', '${asset.status}')" class="text-[9px] font-black uppercase px-4 py-2 rounded-full ${asset.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}">
                        ${asset.status}
                    </button>
                </td>
                <td class="p-6 rounded-r-2xl text-right">
                    <button onclick="killAsset('${id}')" class="text-danger opacity-40 hover:opacity-100 transition"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    });
}

// 4. GLOBAL ACTIONS
window.toggleAsset = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Maintenance' : 'Active';
    await updateDoc(doc(db, "assets", id), { status: newStatus });
};

window.killAsset = async (id) => {
    if (confirm("Permanently delete this asset from the registry?")) {
        await deleteDoc(doc(db, "assets", id));
    }
};