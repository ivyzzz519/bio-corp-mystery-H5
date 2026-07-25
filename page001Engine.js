function bind001Interactions() {
  const currentUserKey = "oa_current_user";
  const storedUser = localStorage.getItem(currentUserKey);
  const isLoggedOut = storedUser === "logged_out";
  if (storedUser === "linlan") {
    window.location.href = window.GameProgressTracker
      ? window.GameProgressTracker.resolveUrlWithStage("./007-desk-linlan.html")
      : "./007-desk-linlan.html";
    return;
  }
  if (!isLoggedOut) {
    if (window.OaWorkbenchNav) {
      window.OaWorkbenchNav.persistDesk("linmin");
    } else {
      localStorage.setItem(currentUserKey, "linmin");
    }
  }

  const accountButton = document.getElementById("accountButton");
  const accountMenu = document.getElementById("accountMenu");
  const accountAvatar = document.getElementById("accountAvatar");
  const accountName = document.getElementById("accountName");
  const accountSubtitle = document.getElementById("accountSubtitle");
  const logoutButton = document.getElementById("logoutButton");
  const loginButton = document.getElementById("loginButton");
  const recoverModal = document.getElementById("recoverModal");
  const recoverCloseButton = document.getElementById("recoverCloseButton");
  const loginModal = document.getElementById("loginModal");
  const loginCloseButton = document.getElementById("loginCloseButton");
  const loginAccountInput = document.getElementById("loginAccountInput");
  const loginPasswordInput = document.getElementById("loginPasswordInput");
  const loginFeedback = document.getElementById("loginFeedback");
  const loginSubmitButton = document.getElementById("loginSubmitButton");
  const loginRecoverToggleButton = document.getElementById(
    "loginRecoverToggleButton"
  );
  const loginRecoverPanel = document.getElementById("loginRecoverPanel");
  const loginRecoverAnswerInput = document.getElementById(
    "loginRecoverAnswerInput"
  );
  const loginRecoverSubmitButton = document.getElementById(
    "loginRecoverSubmitButton"
  );
  const loginRecoverFeedback = document.getElementById("loginRecoverFeedback");

  const recoverStep1 = document.getElementById("recoverStep1");
  const recoverStep2 = document.getElementById("recoverStep2");
  const recoverStep3 = document.getElementById("recoverStep3");
  const recoverStep1Submit = document.getElementById("recoverStep1Submit");
  const recoverStep2Submit = document.getElementById("recoverStep2Submit");
  const recoverEmployeeId = document.getElementById("recoverEmployeeId");
  const recoverAnswer = document.getElementById("recoverAnswer");
  const recoverFeedback = document.getElementById("recoverFeedback");
  const mailboxNavLink = document.getElementById("mailboxNavLink");
  const mailUnreadBadge = document.getElementById("mailUnreadBadge");
  const dashboardBlocks = Array.from(document.querySelectorAll("main > header, main > section"));
  const workbenchTopBar = document.querySelector("main > div:first-child");
  const loggedOutPanel = document.createElement("section");
  loggedOutPanel.id = "loggedOutPanel";
  loggedOutPanel.className =
    "hidden rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm";
  loggedOutPanel.innerHTML = `
    <h2 class="text-xl font-bold text-slate-800">尚未登录</h2>
    <p class="mt-2 text-sm text-slate-500">登录员工账号后查看对应工作台内容。</p>
    <button id="loggedOutLoginButton" class="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white" type="button">登录账号</button>
  `;
  if (workbenchTopBar) {
    workbenchTopBar.insertAdjacentElement("afterend", loggedOutPanel);
  }

  if (!accountButton || !accountMenu) {
    return;
  }

  const authState = {
    loggedIn: !isLoggedOut
  };

  const readStateKey = "oa_mailbox_read";
  const isMailboxRead = () => localStorage.getItem(readStateKey) === "1";
  const renderMailboxUnread = () => {
    if (!mailUnreadBadge) {
      return;
    }
    mailUnreadBadge.classList.toggle("hidden", isMailboxRead());
  };

  const renderAuthState = () => {
    if (authState.loggedIn) {
      dashboardBlocks.forEach((block) => block.classList.remove("hidden"));
      loggedOutPanel.classList.add("hidden");
      accountAvatar.textContent = "林";
      accountAvatar.classList.remove("bg-slate-400");
      accountAvatar.classList.add("bg-blue-600");
      accountName.textContent = "林敏";
      accountSubtitle.textContent = "IT支撑组";
      logoutButton.classList.remove("hidden");
      loginButton.classList.add("hidden");
      return;
    }

    accountAvatar.textContent = "未";
    accountAvatar.classList.remove("bg-blue-600");
    accountAvatar.classList.add("bg-slate-400");
    accountName.textContent = "未登录";
    accountSubtitle.textContent = "点击登录";
    dashboardBlocks.forEach((block) => block.classList.add("hidden"));
    loggedOutPanel.classList.remove("hidden");
    logoutButton.classList.add("hidden");
    loginButton.classList.remove("hidden");
  };

  const closeAllPanels = () => {
    accountMenu.classList.add("hidden");
  };

  const positionAccountMenu = () => {
    if (window.innerWidth >= 768) {
      accountMenu.style.removeProperty("top");
      accountMenu.style.removeProperty("right");
      return;
    }

    const rect = accountButton.getBoundingClientRect();
    accountMenu.style.top = `${Math.round(rect.bottom + 8)}px`;
    accountMenu.style.right = `${Math.max(12, Math.round(window.innerWidth - rect.right))}px`;
  };

  const openLoginModal = () => {
    loginFeedback.textContent = "";
    loginRecoverFeedback.textContent = "";
    loginRecoverAnswerInput.value = "";
    loginRecoverPanel.classList.add("hidden");
    loginModal.classList.remove("hidden");
    loginModal.classList.add("flex");
  };

  accountButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!authState.loggedIn) {
      openLoginModal();
      return;
    }
    const willOpen = accountMenu.classList.contains("hidden");
    if (willOpen) {
      positionAccountMenu();
    }
    accountMenu.classList.toggle("hidden");
  });

  window.addEventListener("resize", () => {
    if (!accountMenu.classList.contains("hidden")) {
      positionAccountMenu();
    }
  });

  document.addEventListener("click", () => {
    closeAllPanels();
  });

  logoutButton.addEventListener("click", () => {
    authState.loggedIn = false;
    localStorage.setItem(currentUserKey, "logged_out");
    renderAuthState();
    closeAllPanels();
  });

  loginButton.addEventListener("click", () => {
    closeAllPanels();
    openLoginModal();
  });

  const loggedOutLoginButton = document.getElementById("loggedOutLoginButton");
  if (loggedOutLoginButton) {
    loggedOutLoginButton.addEventListener("click", openLoginModal);
  }

  recoverCloseButton.addEventListener("click", () => {
    recoverModal.classList.add("hidden");
    recoverModal.classList.remove("flex");
  });

  loginCloseButton.addEventListener("click", () => {
    loginModal.classList.add("hidden");
    loginModal.classList.remove("flex");
  });

  loginRecoverToggleButton.addEventListener("click", () => {
    const account = (loginAccountInput.value || "").trim();
    if (!account) {
      return;
    }
    if (account !== "160423") {
      loginRecoverFeedback.textContent = "";
      loginRecoverAnswerInput.value = "";
      loginRecoverPanel.classList.add("hidden");
      loginFeedback.textContent = "账号不存在";
      return;
    }
    loginFeedback.textContent = "";
    loginRecoverFeedback.textContent = "";
    loginRecoverPanel.classList.toggle("hidden");
  });

  loginRecoverSubmitButton.addEventListener("click", () => {
    const answer = (loginRecoverAnswerInput.value || "").trim();
    if (answer === "2000年3月16日") {
      loginRecoverFeedback.classList.remove("text-rose-600");
      loginRecoverFeedback.classList.add("text-emerald-600");
      loginRecoverFeedback.textContent = "验证成功，密码为：1234Qwer";
      return;
    }

    loginRecoverFeedback.classList.remove("text-emerald-600");
    loginRecoverFeedback.classList.add("text-rose-600");
    loginRecoverFeedback.textContent = "答案错误";
  });

  loginSubmitButton.addEventListener("click", () => {
    const account = (loginAccountInput.value || "").trim();
    const password = (loginPasswordInput.value || "").trim();

    if (account === "250812" && password === "LM@250812") {
      localStorage.setItem(currentUserKey, "linmin");
      window.location.reload();
      return;
    }

    if (account === "160423" && password === "1234Qwer") {
      localStorage.setItem(currentUserKey, "linlan");
      if (window.GameProgressTracker) {
        window.GameProgressTracker.markAction("loginLinlan");
      }
      window.location.href = window.GameProgressTracker
        ? window.GameProgressTracker.resolveUrlWithStage("./007-desk-linlan.html")
        : "./007-desk-linlan.html";
      return;
    }

    if (account === "120627" && password === "92TWSL66") {
      localStorage.setItem(currentUserKey, "zhangchi");
      if (window.GameProgressTracker) {
        window.GameProgressTracker.markAction("loginZhangchi");
      }
      window.location.href = window.GameProgressTracker
        ? window.GameProgressTracker.resolveUrlWithStage("./012-desk-zhangchi.html")
        : "./012-desk-zhangchi.html";
      return;
    }

    loginFeedback.textContent = "密码错误";
  });

  recoverStep1Submit.addEventListener("click", () => {
    recoverFeedback.textContent = "";
    if ((recoverEmployeeId.value || "").trim() !== "160423") {
      recoverFeedback.textContent = "工号不匹配，请重试。";
      return;
    }
    recoverStep1.classList.add("hidden");
    recoverStep2.classList.remove("hidden");
  });

  recoverStep2Submit.addEventListener("click", () => {
    recoverFeedback.textContent = "";
    if ((recoverAnswer.value || "").trim() !== "2000年3月16日") {
      recoverFeedback.textContent = "答案错误，请重试。";
      return;
    }
    recoverStep2.classList.add("hidden");
    recoverStep3.classList.remove("hidden");
  });

  if (mailboxNavLink) {
    mailboxNavLink.addEventListener("click", () => {
      localStorage.setItem(readStateKey, "1");
      renderMailboxUnread();
    });
  }

  renderAuthState();
  renderMailboxUnread();
}

document.addEventListener("DOMContentLoaded", () => {
  bind001Interactions();
});

